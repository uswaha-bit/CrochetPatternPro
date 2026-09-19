import { useState } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaUserCircle,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

import Header from "../../ui/Header";
import PostModal from "./PostModal";
import ImageCarousel from "../../ui/ImageCrousel";
import Spinner from "../../ui/Spinner";
import { useGetNewsFeed } from "./useGetNewsFeed";
import { useUser } from "../userDashboard/useUser";
import { useLikePost } from "../../hooks/useLikePost";
import { useSavePost } from "../../hooks/useSavePost";
import { useToggleFollow } from "../../hooks/useToggleFollow";
import { dateConverter } from "../../utils/dateConverter";
import { colors, fontStack, HEADER_HEIGHT, ghostButton } from "../../ui/theme";
import {
  Post,
  PostHeader,
  PostUserInfo,
  Avatar,
  PostUserDetails,
  PostUserName,
  PostUserRole,
  PostMeta,
  PostTime,
  PostTitle,
  PostDesc,
  MediaFrame,
  PostActions,
  ActionButton,
} from "../../ui/PostStyles";

/* ---------- Page ---------- */
const Page = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${colors.paper};
  color: ${colors.ink};
  font-family: ${fontStack};

  /* Graph paper behind the top of the page, fading out */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 460px;
    z-index: -1;
    background-image: linear-gradient(${colors.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${colors.grid} 1px, transparent 1px);
    background-size: 32px 32px;
    -webkit-mask-image: linear-gradient(#000, transparent);
    mask-image: linear-gradient(#000, transparent);
  }
`;

const Content = styled.main`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  gap: 48px;
  align-items: start;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(28px, 5vw, 64px) clamp(20px, 4vw, 48px) 96px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const Title = styled.h1`
  margin: 0 0 28px;
  font-size: clamp(2.4rem, 5.5vw, 4.25rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
  text-wrap: balance;
`;

/* ---------- Composer: looks like a field, opens the modal ---------- */
const NewPostButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 40px;
  padding: 10px 10px 10px 20px;
  border: 2px solid ${colors.ink};
  border-radius: 14px;
  background: ${colors.surface};
  color: ${colors.muted};
  font: inherit;
  font-size: 1.05rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 0 ${colors.ink};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const NewPostChip = styled.span`
  flex: none;
  padding: 8px 18px;
  border-radius: 10px;
  background: ${colors.yarn};
  color: ${colors.ink};
  font-weight: 700;
`;

/* ---------- Follow button ---------- */
const FollowButton = styled.button`
  ${ghostButton}
  flex: none;
  min-width: 100px;
  min-height: 36px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.9rem;

  ${({ $following }) =>
    $following &&
    css`
      background: ${colors.ink};
      color: ${colors.paper};

      &:hover:not(:disabled) {
        background: transparent;
        color: ${colors.ink};
      }
    `}
`;

/* ---------- Suggestions ---------- */
const Sidebar = styled.aside`
  position: sticky;
  top: calc(${HEADER_HEIGHT} + 24px);

  @media (max-width: 900px) {
    position: static;
  }
`;

const SuggestionsCard = styled.section`
  padding: 24px;
  border: 2px dashed ${colors.stitchLine};
  border-radius: 16px;
  background: ${colors.surface};
`;

const SuggestionsTitle = styled.h2`
  margin: 0 0 20px;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  & + & {
    margin-top: 18px;
  }
`;

/* ---------- Status ---------- */
const StatusText = styled.div`
  padding: 32px 0;
  color: ${colors.muted};
  text-align: center;
`;

const ErrorMessage = styled.div`
  margin-bottom: 24px;
  padding: 14px 16px;
  border: 2px solid ${colors.error};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.error};
  font-weight: 600;
  text-align: center;
`;

const LoadMoreTrigger = styled.div`
  padding: 32px 0;
  border-top: 2px dashed ${colors.stitchLine};
  color: ${colors.muted};
  text-align: center;
`;

function NewsFeed() {
  const user = useSelector((store) => store.user);
  const _id = user.userDetail?._id;
  const { user: userData } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likingPostId, setLikingPostId] = useState(null);
  const [activeSaveId, setActiveSaveId] = useState(null);
  const [activeFollowId, setActiveFollowId] = useState(null);
  const queryClient = useQueryClient();

  const { toggleFollow, isPendingFollow } = useToggleFollow();
  const { mutate: toggleLike, isPending: isPendingLike } = useLikePost();
  const { savePost, isPendingSaving } = useSavePost();

  const { data, hasNextPage, isError, isLoading, isFetchingNextPage, ref } =
    useGetNewsFeed();

  const navItemsForLggedIn = [
    { label: "Learn", path: "/learn" },
    { label: "Editor", path: `/editor` },
    { label: "Profile", path: `/user/${_id}` },
  ];
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Register", path: "/register" },
    { label: "Login", path: "/login" },
  ];

  const feed = queryClient.getQueryData(["newsfeed"]);
  const suggestedUsers = queryClient.getQueryData(["userSuggestions"]);
  const allPosts = feed?.pages?.flatMap((page) => page?.data?.posts ?? []);

  const handleOpen = () => setIsModalOpen(true);
  const handlePostModalCancel = () => setIsModalOpen(false);

  const handleFollow = (userId) => {
    setActiveFollowId(userId);
    toggleFollow(userId, {
      onSettled: () => setActiveFollowId(null),
    });
  };

  const handleLike = (e, postId) => {
    e.stopPropagation();
    setLikingPostId(postId);
    toggleLike(postId, {
      onSettled: () => setLikingPostId(null),
    });
  };

  const handleSave = (e, postId) => {
    e.stopPropagation();
    setActiveSaveId(postId);
    savePost(postId, {
      onSettled: () => setActiveSaveId(null),
    });
  };

  const renderFollowButton = (targetId) => {
    const isFollowing = !!userData?.following?.includes(targetId);
    const isBusy = isPendingFollow && activeFollowId === targetId;
    return (
      <FollowButton
        type="button"
        $following={isFollowing}
        aria-pressed={isFollowing}
        disabled={isBusy}
        onClick={() => handleFollow(targetId)}
      >
        {isBusy ? (
          <Spinner width="16px" border="2px" />
        ) : isFollowing ? (
          "Following"
        ) : (
          "Follow"
        )}
      </FollowButton>
    );
  };

  const renderPost = (post) => {
    const hasLiked = post.likes.includes(_id);
    const isSaved = post.saves.includes(_id);
    const isLikeBusy = isPendingLike && likingPostId === post._id;
    const isSaveBusy = isPendingSaving && activeSaveId === post._id;

    return (
      <Post key={post._id}>
        <PostHeader>
          <PostUserInfo>
            {post.createdBy?.profileImage?.url ? (
              <Avatar
                $size={48}
                src={post.createdBy.profileImage.url}
                alt=""
              />
            ) : (
              <FaUserCircle size={48} color={colors.ink} />
            )}
            <PostUserDetails>
              <PostUserName>
                {post.createdBy.name || "Sarah Wells"}
              </PostUserName>
              <PostUserRole>
                {post.createdBy.skillLevel || "Intermediate"}
              </PostUserRole>
            </PostUserDetails>
          </PostUserInfo>

          <PostMeta>
            <PostTime>{dateConverter(post.createdAt)}</PostTime>
            {_id !== post.createdBy._id &&
              renderFollowButton(post.createdBy._id)}
          </PostMeta>
        </PostHeader>

        <PostTitle>{post.title}</PostTitle>
        {post.description && <PostDesc>{post.description}</PostDesc>}

        {post.content?.length > 0 && (
          <MediaFrame>
            <ImageCarousel images={post.content} />
          </MediaFrame>
        )}

        <PostActions>
          <ActionButton
            type="button"
            $active={hasLiked}
            $activeColor={colors.error}
            aria-pressed={hasLiked}
            aria-label={hasLiked ? "Unlike post" : "Like post"}
            onClick={(e) => handleLike(e, post._id)}
          >
            {isLikeBusy ? (
              <Spinner width="20px" border="2px" />
            ) : hasLiked ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
            <span>{post.likes.length}</span>
          </ActionButton>

          <ActionButton
            type="button"
            $active={isSaved}
            $activeColor={colors.leaf}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Unsave post" : "Save post"}
            onClick={(e) => handleSave(e, post._id)}
          >
            {isSaveBusy ? (
              <Spinner width="20px" border="2px" />
            ) : isSaved ? (
              <FaBookmark />
            ) : (
              <FaRegBookmark />
            )}
            <span>{post?.saves?.length}</span>
          </ActionButton>
        </PostActions>
      </Post>
    );
  };

  return (
    <Page>
      <Header navItems={user.isLoggedIn ? navItemsForLggedIn : navItems} />

      <Content>
        <section>
          <Title>Community feed</Title>

          <NewPostButton type="button" onClick={handleOpen}>
            <span>Start a new post</span>
            <NewPostChip>Post</NewPostChip>
          </NewPostButton>

          {isLoading && <StatusText>Loading your feed...</StatusText>}

          {isError && (
            <ErrorMessage role="alert">
              Error loading feed: Something went wrong
            </ErrorMessage>
          )}

          {allPosts?.map((post) => renderPost(post))}

          <LoadMoreTrigger ref={ref}>
            {isFetchingNextPage && <div>Loading more posts...</div>}
            {!hasNextPage && data?.pages.length > 0 && (
              <div>You have reached the end of your feed!</div>
            )}
          </LoadMoreTrigger>
        </section>

        <Sidebar>
          <SuggestionsCard>
            <SuggestionsTitle>Suggestions</SuggestionsTitle>
            {suggestedUsers?.suggestedUsers?.map((suggestion) => (
              <SuggestionItem key={suggestion._id}>
                <PostUserInfo>
                  {suggestion.profileImage?.url ? (
                    <Avatar $size={44} src={suggestion.profileImage.url} alt="" />
                  ) : (
                    <FaUserCircle size={44} color={colors.ink} />
                  )}
                  <PostUserDetails>
                    <PostUserName>{suggestion.name}</PostUserName>
                    <PostUserRole>{suggestion.skillLevel}</PostUserRole>
                  </PostUserDetails>
                </PostUserInfo>
                {renderFollowButton(suggestion._id)}
              </SuggestionItem>
            ))}
          </SuggestionsCard>
        </Sidebar>
      </Content>

      {isModalOpen && (
        <PostModal
          show={isModalOpen}
          handlePostModalCancel={handlePostModalCancel}
        />
      )}
    </Page>
  );
}

export default NewsFeed;