import { useSelector, useDispatch } from "react-redux";
import Header from "../../ui/Header";
import styled from "styled-components";
import React, { useState } from "react";
import HeaderButton from "../../ui/HeaderButton";
import PostModal from "./PostModal";
import { useGetNewsFeed } from "./useGetNewsFeed";
import { useQueryClient } from "@tanstack/react-query";
import { dateConverter } from "../../utils/dateConverter";
import ImageCarousel from "../../ui/ImageCrousel";
import {
  FaUserCircle,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";

import { useLikePost } from "../../hooks/useLikePost";
import { useSavePost } from "../../hooks/useSavePost";
import Spinner from "../../ui/Spinner";
import { useToggleFollow } from "../../hooks/useToggleFollow";
import { useUser } from "../userDashboard/useUser";
const FollowButton = styled.button`
  background-color: var(--secondary-color);
  font-size: 16px;
  display: flex;
  border: none;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  cursor: pointer;
  padding: 5px 15px;
  &:hover {
    background-color: #bbceba;
  }
`;
const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  //font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

// const Logo = styled.h1`
//   font-size: 2rem;
//   font-weight: 300;
//   color: #333;
//   margin: 0;
// `;

// const NavButtons = styled.div`
//   display: flex;
//   gap: 1rem;
// `;

// const NavButton = styled.button`
//   background-color: #c8e6c9;
//   border: none;
//   padding: 0.75rem 2rem;
//   border-radius: 25px;
//   font-size: 1rem;
//   cursor: pointer;
//   transition: background-color 0.2s;

//   &:hover {
//     background-color: #a5d6a7;
//   }
// `;

// const UserProfile = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 1rem;
// `;

// const UserName = styled.span`
//   font-size: 1rem;
//   color: #333;
// `;

// const Avatar = styled.div`
//   width: 40px;
//   height: 40px;
//   background-color: #7986cb;
//   border-radius: 50%;
// `;

const MainContent = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 2rem;
`;
const PostDesc = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;
const HeartIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  color: ${({ liked }) => (liked ? "crimson" : "#555")};
  cursor: pointer;

  svg {
    transition: color 0.3s ease;
  }
`;
const SaveIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: ${({ saved }) => (saved ? "#6366f1" : "#4b5563")}; // Indigo for saved

  svg {
    transition: 0.2s ease;
    font-size: 18px;
  }
`;

const FeedSection = styled.div`
  flex: 2;
`;

const FeedTab = styled.div`
  background-color: #d0d0d0;
  padding: 1rem;
  border-radius: 10px 10px 0 0;
  font-weight: 500;
  margin-bottom: 0;
`;

const FeedContent = styled.div`
  background-color: #e0e0e0;
  padding: 2rem;
  border-radius: 0 0 10px 10px;
`;

const NewPostButton = styled.button`
  width: 100%;
  background-color: #ebffe9;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  text-align: left;
  margin-bottom: 2rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #bbceba;
  }
`;

const Post = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PostUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-transform: capitalize;
`;

const PostAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-size: cover;
`;

const PostUserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostUserName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
`;

const PostUserRole = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const PostTime = styled.span`
  color: #999;
  font-size: 0.9rem;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
`;

const PostContent = styled.p`
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
`;

const PatternImage = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-family: monospace;
  font-size: 0.8rem;
  line-height: 1.2;
  text-align: center;
  white-space: pre-line;
`;

const CrochetImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const PostStats = styled.div`
  display: flex;
  gap: 2rem;
  color: #666;
  font-size: 0.9rem;
`;

const Sidebar = styled.div`
  flex: 1;
`;

const SuggestionsCard = styled.div`
  background-color: #d0d0d0;
  border-radius: 15px;
  padding: 1.5rem;
`;

const SuggestionsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: #333;
`;

const SuggestionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const SuggestionUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SuggestionAvatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-size: cover;
`;

const SuggestionUserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SuggestionUserName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  text-transform: capitalize;
`;

const SuggestionUserRole = styled.span`
  color: #666;
  font-size: 0.85rem;
  text-transform: capitalize;
`;

const SuggestionAddButton = styled.button`
  background: none;
  border: none;
  color: #5c6bc0;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const ViewAllButton = styled.button`
  background: none;
  border: none;
  color: #5c6bc0;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: #666;
`;
const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
`;

const LoadMoreTrigger = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;
function NewsFeed() {
  const user = useSelector((store) => store.user);
  //const { name, _id, following } = user.userDetail;
  const { name, _id } = user.userDetail;
  const {
    isLoading: isLoadingUser,
    user: userData,
    error,
    refetch,
  } = useUser();
  console.log(userData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likingPostId, setLikingPostId] = useState(null);
  const [activeSaveId, setActiveSaveId] = useState(null);
  const { toggleFollow, isPendingFollow } = useToggleFollow();
  const [activeFollowId, setActiveFollowId] = useState(null);
  const queryClient = useQueryClient();

  const { mutate: toggleLike, isPending: isPendingLike } = useLikePost();
  const { savePost, isPendingSaving } = useSavePost();
  const handleFollow = (userId) => {
    setActiveFollowId(userId);
    toggleFollow(userId, {
      onSettled: () => {
        setActiveFollowId(null);
      },
    });
  };
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    ref,
  } = useGetNewsFeed();

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
  console.log(feed);
  const suggestedUsers = queryClient.getQueryData(["userSuggestions"]);
  console.log(suggestedUsers?.suggestedUsers);
  const allPosts = feed?.pages?.flatMap((pages) => pages?.data?.posts);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handlePostModalCancel = () => {
    setIsModalOpen(false);
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

  const renderPost = (post, index) => {
    const hasLiked = post.likes.includes(_id);
    const isSaved = post.saves.includes(_id);
    const isFollowing = userData?.following.includes(post.createdBy._id);
    return (
      <Post key={post._id}>
        <PostHeader>
          <PostUserInfo>
            {post.createdBy?.profileImage?.url ? (
              <PostAvatar>
                <img
                  src={post.createdBy.profileImage?.url}
                  alt="User avatar"
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </PostAvatar>
            ) : (
              <FaUserCircle size={50} color="#333" />
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <PostTime>{dateConverter(post.createdAt)}</PostTime>
            {_id !== post.createdBy._id && (
              <FollowButton
                onClick={() => handleFollow(post.createdBy._id)}
                disabled={
                  isPendingFollow && activeFollowId === post.createdBy._id
                }
              >
                {isPendingFollow && activeFollowId === post.createdBy._id ? (
                  <Spinner width="16px" border="2px" />
                ) : isFollowing ? (
                  "followed"
                ) : (
                  "follow"
                )}
              </FollowButton>
            )}
          </div>
        </PostHeader>

        <PostContent>{post.title}</PostContent>
        <PostDesc>{post.description}</PostDesc>

        <ImageCarousel images={post.content} />

        <PostStats>
          <HeartIcon liked={hasLiked} onClick={(e) => handleLike(e, post._id)}>
            <span>{post.likes.length}</span>
            {isPendingLike && likingPostId === post._id ? (
              <Spinner width="20px" border="2px" />
            ) : hasLiked ? (
              <FaHeart />
            ) : (
              <FaRegHeart />
            )}
          </HeartIcon>
          <SaveIcon saved={isSaved} onClick={(e) => handleSave(e, post._id)}>
            <span>{post?.saves?.length}</span>
            {isPendingSaving && activeSaveId === post._id ? (
              <Spinner width="20px" border="2px" />
            ) : isSaved ? (
              <FaBookmark />
            ) : (
              <FaRegBookmark />
            )}
          </SaveIcon>
        </PostStats>
      </Post>
    );
  };

  return (
    <>
      <Container>
        {user.isLoggedIn ? (
          <Header navItems={navItemsForLggedIn} />
        ) : (
          <Header navItems={navItems} />
        )}

        <MainContent>
          <FeedSection>
            <FeedTab>Feed</FeedTab>
            <FeedContent>
              <NewPostButton onClick={handleOpen}>
                Start a new post
              </NewPostButton>
              {/* Handle loading state */}
              {isLoading && (
                <LoadingSpinner>Loading your feed...</LoadingSpinner>
              )}

              {/* Handle error state */}
              {isError && (
                <ErrorMessage>
                  Error loading feed:{" "}
                  {isError?.message || "Something went wrong"}
                </ErrorMessage>
              )}

              {/* Render posts from API */}
              {allPosts?.map((post, postIndex) => {
                return renderPost(post, `${postIndex}`);
              })}

              <LoadMoreTrigger ref={ref}>
                {isFetchingNextPage && (
                  <LoadingSpinner>Loading more posts...</LoadingSpinner>
                )}
                {!hasNextPage && data?.pages.length > 0 && (
                  <div>You have reached the end of your feed!</div>
                )}
              </LoadMoreTrigger>
            </FeedContent>
          </FeedSection>

          <Sidebar>
            <SuggestionsCard>
              <SuggestionsTitle>Suggestions</SuggestionsTitle>
              {suggestedUsers?.suggestedUsers?.map((suggestion, index) => {
                const isFollowing = userData?.following.includes(
                  suggestion._id
                );
                return (
                  <SuggestionItem key={index}>
                    <SuggestionUserInfo>
                      {suggestion.profileImage?.url ? (
                        <SuggestionAvatar src={suggestion.profileImage.url} />
                      ) : (
                        <FaUserCircle size={45} color="#333" />
                      )}
                      <SuggestionUserDetails>
                        <SuggestionUserName>
                          {suggestion.name}
                        </SuggestionUserName>
                        <SuggestionUserRole>
                          {suggestion.skillLevel}
                        </SuggestionUserRole>
                      </SuggestionUserDetails>
                    </SuggestionUserInfo>

                    <FollowButton
                      onClick={() => handleFollow(suggestion._id)}
                      disabled={
                        isPendingFollow && activeFollowId === suggestion._id
                      }
                    >
                      {isPendingFollow && activeFollowId === suggestion._id ? (
                        <Spinner width="16px" border="2px" />
                      ) : isFollowing ? (
                        "followed"
                      ) : (
                        "follow"
                      )}
                    </FollowButton>
                  </SuggestionItem>
                );
              })}
            </SuggestionsCard>
          </Sidebar>
        </MainContent>

        {isModalOpen && (
          <PostModal
            show={isModalOpen}
            handlePostModalCancel={handlePostModalCancel}
          />
        )}
      </Container>
    </>
  );
}

export default NewsFeed;
