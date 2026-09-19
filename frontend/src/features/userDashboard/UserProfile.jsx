import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import toast from "react-hot-toast";
import {
  FaTrash,
  FaPencilAlt,
  FaEllipsisV,
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaUserCircle,
} from "react-icons/fa";

import Header from "../../ui/Header";
import FullPageSpinner from "../../ui/FullPageSpinner";
import Spinner from "../../ui/Spinner";
import ImageCarousel from "../../ui/ImageCrousel";
import { DropdownMenuWrapper, DropdownItem } from "../../ui/DropDownStyles";
import { colors, fontStack } from "../../ui/theme";
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
  IconButton,
} from "../../ui/PostStyles";

import { useUser } from "./useUser";
import { useGetPost } from "./useGetPost";
import { useDeletePost } from "./useDeletePost";
import { useGetSavedPost } from "./useGetSavedPosts";
import { useGetSuggestions } from "./useGetSuggestions";
import { useLogout } from "../login/useLogout";
import { logoutUser, setUser } from "../login/loginSlice";
import { resetEditor } from "../editor/editorSlice";
import { useDeletePattern, useGetPatterns } from "../../hooks/usePattern";
import { useLikePost } from "../../hooks/useLikePost";
import { useSavePost } from "../../hooks/useSavePost";
import { dateConverter } from "../../utils/dateConverter";
import addImg from "../../assets/add-image.png";

import PostModal from "../community/PostModal";
import EditPostModal from "./EditPostModal";
import UpdateUserModal from "./UpdateUserModal";
import DeletePatternModal from "./DeletePatternModal";
import DeletePostModal from "./DeletePostModal";

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
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(20px, 4vw, 48px) clamp(20px, 4vw, 48px) 96px;
`;

/* ---------- Cover + menu ---------- */
const Cover = styled.div`
  position: relative;
  height: clamp(150px, 24vw, 240px);
  border: 2px solid ${colors.ink};
  border-radius: 16px;
  background-color: ${colors.surface};
  background-image: linear-gradient(${colors.grid} 1px, transparent 1px),
    linear-gradient(90deg, ${colors.grid} 1px, transparent 1px);
  background-size: 24px 24px;
`;

const CoverImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  object-fit: cover;
`;

const CoverEmpty = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${colors.muted};
  font-weight: 600;
  text-align: center;

  img {
    width: 40px;
    opacity: 0.8;
  }
`;

const MenuAnchor = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background: ${colors.surface};
  color: ${colors.ink};
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${colors.ink};
    color: ${colors.paper};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Restyles your existing dropdown pieces from here; DropDownStyles is untouched
const ProfileMenu = styled(DropdownMenuWrapper)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: auto;
  bottom: auto;
  z-index: 20;
  box-sizing: border-box;
  min-width: 190px;
  padding: 6px;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background: ${colors.surface};
  box-shadow: 0 4px 0 ${colors.ink};
  overflow: hidden;
`;

const MenuItem = styled(DropdownItem)`
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  background: transparent;
  color: ${colors.ink};
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(22, 48, 32, 0.08);
    color: ${colors.ink};
  }
`;

/* ---------- Identity ---------- */
const Identity = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 40px;
  margin-top: -20px; /* the avatar overlaps the cover */
  padding: 0 8px;
`;

const Who = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px 20px;
  min-width: 0;
`;

const AvatarRing = styled.div`
  flex: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  box-sizing: border-box;
  // width: 128px;
  // height: 128px;
  border: 3px solid ${colors.ink};
  border-radius: 50%;
  background: ${colors.paper};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const WhoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding-bottom: 6px;
`;

const Name = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  font-variation-settings: "opsz" 96;
  text-transform: capitalize;
  overflow-wrap: anywhere;
`;

const Skill = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 8px;
  background: ${colors.ink};
  color: ${colors.paper};
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: capitalize;
`;

const Stats = styled.div`
  display: flex;
  gap: 28px;
  padding-bottom: 6px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatNumber = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
`;

const StatLabel = styled.span`
  color: ${colors.muted};
  font-size: 0.9rem;
`;

/* ---------- Tabs ---------- */
const Tabs = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 48px;
  padding: 4px 0 20px;
  overflow-x: auto;
`;

const Tab = styled.button`
  position: relative;
  flex: none;
  padding: 12px 20px;
  border: 0;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? colors.yarn : "transparent")};
  box-shadow: ${({ $active }) => ($active ? `0 4px 0 ${colors.ink}` : "none")};
  color: ${colors.ink};
  font: inherit;
  font-size: 1.05rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  white-space: nowrap;
  cursor: pointer;

  /* dashed seam on the active tab, like the patch button */
  &::after {
    content: "";
    position: absolute;
    inset: 4px;
    border: 2px dashed rgba(22, 48, 32, 0.5);
    border-radius: 8px;
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    pointer-events: none;
  }

  &:hover span {
    text-decoration: underline wavy
      ${({ $active }) => ($active ? colors.ink : colors.yarn)};
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }
`;

const Panel = styled.div`
  border-top: 2px dashed ${colors.stitchLine};
`;

// The first post's own top border would double up with the panel's
const PostList = styled.div`
  & > article:first-child {
    border-top: 0;
  }
`;

const EmptyState = styled.div`
  margin-top: 32px;
  padding: 56px 20px;
  border: 2px dashed ${colors.stitchLine};
  border-radius: 16px;
  color: ${colors.muted};
  font-size: 1.1rem;
  text-align: center;
`;

/* ---------- Patterns ---------- */
const PatternGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 32px 24px;
  padding-top: 32px;
`;

const PatternCard = styled.div`
  position: relative;
`;

const PatternOpen = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover h3 {
    text-decoration: underline wavy ${colors.yarn};
    text-decoration-thickness: 2px;
    text-underline-offset: 6px;
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 4px;
    border-radius: 12px;
  }
`;

// Each pattern sits on a little square of graph paper
const PatternThumb = styled.div`
  display: grid;
  place-items: center;
  overflow: hidden;
  box-sizing: border-box;
  aspect-ratio: 4 / 3;
  margin-bottom: 12px;
  border: 2px solid ${colors.ink};
  border-radius: 12px;
  background-color: ${colors.surface};
  background-image: linear-gradient(${colors.grid} 1px, transparent 1px),
    linear-gradient(90deg, ${colors.grid} 1px, transparent 1px);
  background-size: 16px 16px;

  img {
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
    padding: 8px;
    object-fit: contain;
  }
`;

const PatternName = styled.h3`
  margin: 0 0 2px;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
`;

const PatternDate = styled.span`
  color: ${colors.muted};
  font-size: 0.9rem;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 2px solid ${colors.ink};
  border-radius: 10px;
  background: ${colors.surface};
  color: ${colors.ink};
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${colors.error};
    background: ${colors.error};
    color: ${colors.surface};
  }

  &:focus-visible {
    outline: 3px solid ${colors.leaf};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

function UserProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [likingPostId, setLikingPostId] = useState(null);
  const [activeSaveId, setActiveSaveId] = useState(null);
  const [activeTab, setActiveTab] = useState("patterns"); // 'saved' or 'created' or 'patterns'
  const { mutate: deletePattern, isPending } = useDeletePattern();
  const { mutate: deletePost, isPending: isPendingPostDeletion } =
    useDeletePost();
  const { mutate: toggleLike, isPending: isPendingLike } = useLikePost();
  const { savePost, isPendingSaving } = useSavePost();

  // Called for their side effects: they fill the ["userSuggestions"] and
  // ["savedPosts"] caches that the newsfeed and this page read from
  useGetSuggestions();
  useGetSavedPost();

  const [deleteId, setDeleteId] = useState(null);
  const [deletePostId, setDeletePostId] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const { isLoading, refetch } = useUser();
  const { userPosts } = useGetPost(true);
  const { logout, isPending: isLoggingOut } = useLogout();

  const userDetails = useSelector((store) => store.user);
  const { data: patterns, isPending: isLoadingPatterns } = useGetPatterns();
  const {
    _id,
    name,
    skillLevel,
    profileImage,
    coverImage,
    followers,
    following,
  } = userDetails.userDetail;

  function formatDate(isoDate) {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const navItems = [
    { label: "Learn", path: "/learn" },
    { label: "Community", path: `/user/${_id}/newsfeed/` },
    { label: "Editor", path: "/editor" },
  ];

  const getCachedPosts = queryClient.getQueryData(["userPosts"]);
  const getCachedUser = queryClient.getQueryData(["user"]);
  const getCachedSavedPosts = queryClient.getQueryData(["savedPosts"]);

  const handleModalClose = () => setIsModalOpen(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handlePostModalOpen = () => setIsPostModalOpen(true);
  const handlePostModalCancel = () => setIsPostModalOpen(false);
  const handleEditPostModalCancel = () => setShowEditModal(false);
  const handleTabClick = (tabName) => setActiveTab(tabName);

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

  useEffect(() => {
    refetch()
      .then((response) => {
        if (response.data) {
          dispatch(setUser(response.data)); // Dispatch the user data to Redux
        } else {
          dispatch(logoutUser());
          navigate("/login", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, [refetch, dispatch, navigate]);

  function handleLogout() {
    logout(null, {
      onSuccess: () => {
        dispatch(logoutUser());
        queryClient.removeQueries({ queryKey: ["token"] });
        queryClient.removeQueries({ queryKey: ["user"] });
        queryClient.removeQueries({ queryKey: ["userPosts"] });
        queryClient.removeQueries({ queryKey: ["savedPosts"] });
      },
    });
  }
  function confirmDelete(id) {
    setDeleteId(id);
  }
  function confirmDeletePost(id) {
    setDeletePostId(id);
  }
  function handleDeleteConfirm() {
    deletePattern(deleteId, {
      onSuccess: () => {
        toast.success("Pattern deleted successfully");
        setDeleteId(null);
        dispatch(resetEditor());
      },
      onError: (err) => {
        toast.error(err.message);
        setDeleteId(null);
      },
    });
  }
  function handleDeletePostConfirm() {
    deletePost(deletePostId, {
      onSuccess: () => {
        toast.success("Post deleted successfully");
        setDeletePostId(null);
      },
      onError: (err) => {
        toast.error(err.message);
        setDeletePostId(null);
      },
    });
  }

  if (isLoading || isLoggingOut) return <FullPageSpinner />;

  const countFollowing = following?.length || 0;
  const countFollowers = followers?.length || 0;
  const countPatterns = patterns?.length ?? 0;
  const countPosts = userPosts?.posts?.length || 0;
  const countSaved = getCachedSavedPosts?.savedPosts?.length || 0;

  const handlePatternClick = (id) => {
    navigate(`/editor/${id}`);
  };

  const tabs = [
    { id: "patterns", label: `My patterns (${countPatterns})` },
    { id: "created", label: `My posts (${countPosts})` },
    { id: "saved", label: `Saved posts (${countSaved})` },
  ];

  /* ---------- Posts (own posts and saved posts share one layout) ---------- */
  const renderActions = (post) => {
    const hasLiked = post.likes.includes(_id);
    const isSaved = post.saves.includes(_id);
    const isLikeBusy = isPendingLike && likingPostId === post._id;
    const isSaveBusy = isPendingSaving && activeSaveId === post._id;

    return (
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
          <span>{post.saves.length}</span>
        </ActionButton>
      </PostActions>
    );
  };

  const renderPost = (post, isOwn) => {
    const authorName = isOwn ? name : post.createdBy?.name;
    const authorSkill = isOwn ? skillLevel : post.createdBy?.skillLevel;
    const authorImage = isOwn
      ? getCachedUser?.profileImage?.url
      : post.createdBy?.profileImage?.url;

    return (
      <Post key={post._id}>
        <PostHeader>
          <PostUserInfo>
            {authorImage ? (
              <Avatar $size={48} src={authorImage} alt="" />
            ) : (
              <FaUserCircle size={48} color={colors.ink} />
            )}
            <PostUserDetails>
              <PostUserName>{authorName}</PostUserName>
              <PostUserRole>{authorSkill}</PostUserRole>
            </PostUserDetails>
          </PostUserInfo>

          <PostMeta>
            <PostTime>{dateConverter(post.createdAt)}</PostTime>
            {isOwn && (
              <>
                <IconButton
                  type="button"
                  $danger
                  title="Delete"
                  aria-label="Delete post"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeletePost(post._id);
                  }}
                >
                  <FaTrash />
                </IconButton>
                <IconButton
                  type="button"
                  title="Edit"
                  aria-label="Edit post"
                  onClick={() => {
                    setEditPost(post);
                    setShowEditModal(true);
                  }}
                >
                  <FaPencilAlt />
                </IconButton>
              </>
            )}
          </PostMeta>
        </PostHeader>

        <PostTitle>{post.title}</PostTitle>
        {post.description && <PostDesc>{post.description}</PostDesc>}

        {post.content?.length > 0 && (
          <MediaFrame>
            <ImageCarousel images={post.content} />
          </MediaFrame>
        )}

        {renderActions(post)}
      </Post>
    );
  };

  const renderPanel = () => {
    if (activeTab === "created") {
      return getCachedPosts?.posts?.length > 0 ? (
        <PostList>{getCachedPosts.posts.map((post) => renderPost(post, true))}</PostList>
      ) : (
        <EmptyState>
          No posts created yet. Create your first post to get started!
        </EmptyState>
      );
    }

    if (activeTab === "saved") {
      return getCachedSavedPosts?.savedPosts?.length > 0 ? (
        <PostList>
          {getCachedSavedPosts.savedPosts.map((post) => renderPost(post, false))}
        </PostList>
      ) : (
        <EmptyState>
          No saved posts yet. Start exploring and save interesting posts!
        </EmptyState>
      );
    }

    if (isLoadingPatterns) return <Spinner />;

    return patterns?.length > 0 ? (
      <PatternGrid>
        {patterns.map((pattern) => (
          <PatternCard key={pattern._id}>
            <PatternOpen
              type="button"
              onClick={() => handlePatternClick(pattern._id)}
            >
              <PatternThumb>
                {pattern.image && <img src={pattern.image} alt="" />}
              </PatternThumb>
              <PatternName>{pattern.name}</PatternName>
              <PatternDate>{formatDate(pattern.createdAt)}</PatternDate>
            </PatternOpen>
            <DeleteButton
              type="button"
              aria-label={`Delete ${pattern.name}`}
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete(pattern._id);
              }}
            >
              <FaTrash />
            </DeleteButton>
          </PatternCard>
        ))}
      </PatternGrid>
    ) : (
      <EmptyState>
        No patterns created yet. Create your first patterns to get started!
      </EmptyState>
    );
  };

  return (
    <>
      <Page>
        <Header navItems={navItems} />

        <Content>
          <Cover>
            {coverImage?.name ? (
              <CoverImg src={coverImage.url} alt="Cover" />
            ) : (
              <CoverEmpty>
                <img src={addImg} alt="" />
                <div>Edit Profile to add a cover photo</div>
              </CoverEmpty>
            )}

            <MenuAnchor>
              <MenuButton
                type="button"
                aria-label="Profile menu"
                aria-haspopup="menu"
                aria-expanded={isDropDownOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDropDownOpen(!isDropDownOpen);
                }}
              >
                <FaEllipsisV />
              </MenuButton>

              {isDropDownOpen && (
                <ProfileMenu $isOpen={isDropDownOpen} role="menu">
                  <MenuItem
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePostModalOpen();
                      setIsDropDownOpen(false);
                    }}
                  >
                    Create Post
                  </MenuItem>
                  <MenuItem
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModalOpen();
                      setIsDropDownOpen(false);
                    }}
                  >
                    Edit Profile
                  </MenuItem>
                  <MenuItem
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                      setIsDropDownOpen(false);
                    }}
                  >
                    Log out
                  </MenuItem>
                </ProfileMenu>
              )}
            </MenuAnchor>
          </Cover>

          <Identity>
            <Who>
              <AvatarRing>
                {profileImage?.name ? (
                  <img src={profileImage.url} alt="Profile" />
                ) : (
                  <FaUserCircle size={128} color={colors.ink} />
                )}
              </AvatarRing>
              <WhoText>
                <Name>{name}</Name>
                {skillLevel && <Skill>{skillLevel}</Skill>}
              </WhoText>
            </Who>

            <Stats>
              <Stat>
                <StatNumber>{countFollowers}</StatNumber>
                <StatLabel>Followers</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>{countFollowing}</StatNumber>
                <StatLabel>Following</StatLabel>
              </Stat>
              <Stat>
                <StatNumber>{countPosts}</StatNumber>
                <StatLabel>Posts</StatLabel>
              </Stat>
            </Stats>
          </Identity>

          <Tabs role="tablist" aria-label="Your content">
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                $active={activeTab === tab.id}
                onClick={() => handleTabClick(tab.id)}
              >
                <span>{tab.label}</span>
              </Tab>
            ))}
          </Tabs>

          <Panel role="tabpanel">{renderPanel()}</Panel>
        </Content>
      </Page>

      <UpdateUserModal
        show={isModalOpen}
        onHide={handleModalClose}
        userDetail={userDetails.userDetail}
      />
      {showEditModal && (
        <EditPostModal
          handlePostModalCancel={handleEditPostModalCancel}
          show={showEditModal}
          post={editPost}
        />
      )}
      <PostModal
        handlePostModalCancel={handlePostModalCancel}
        show={isPostModalOpen}
      />

      {/* One confirm dialog each, outside the lists */}
      {deletePostId && (
        <DeletePostModal
          isOpen={!!deletePostId}
          onClose={() => setDeletePostId(null)}
          onDelete={handleDeletePostConfirm}
          isDeleting={isPendingPostDeletion}
        />
      )}
      {deleteId && (
        <DeletePatternModal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onDelete={() => handleDeleteConfirm()}
          isDeleting={isPending}
        />
      )}
    </>
  );
}

export default UserProfile;