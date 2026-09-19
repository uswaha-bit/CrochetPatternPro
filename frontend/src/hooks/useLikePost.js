import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { likePost } from "../services/postApi";
import { toast } from "react-hot-toast";

const flipLike = (post, postId, userId) => {
  if (post._id !== postId) return post;
  const liked = post.likes.includes(userId);
  return {
    ...post,
    likes: liked
      ? post.likes.filter((id) => id !== userId)
      : [...post.likes, userId],
  };
};

export function useLikePost() {
  const queryClient = useQueryClient();
  const userId = useSelector((state) => state.user.userDetail?._id);

  return useMutation({
    mutationFn: (postId) => likePost(postId),

    onMutate: async (postId) => {
      await Promise.all(
        ["newsfeed", "userPosts", "savedPosts"].map((key) =>
          queryClient.cancelQueries({ queryKey: [key] })
        )
      );

      // Snapshot so we can roll back if the request fails
      const previous = {
        newsfeed: queryClient.getQueryData(["newsfeed"]),
        userPosts: queryClient.getQueryData(["userPosts"]),
        savedPosts: queryClient.getQueryData(["savedPosts"]),
      };

      // Community feed (infinite query: pages[].data.posts[])
      queryClient.setQueryData(["newsfeed"], (old) =>
        old && {
          ...old,
          pages: old.pages.map((page) =>
            page?.data?.posts
              ? {
                  ...page,
                  data: {
                    ...page.data,
                    posts: page.data.posts.map((p) => flipLike(p, postId, userId)),
                  },
                }
              : page
          ),
        }
      );

      // Profile tabs
      queryClient.setQueryData(["userPosts"], (old) =>
        old && { ...old, posts: old.posts.map((p) => flipLike(p, postId, userId)) }
      );
      queryClient.setQueryData(["savedPosts"], (old) =>
        old && {
          ...old,
          savedPosts: old.savedPosts.map((p) => flipLike(p, postId, userId)),
        }
      );

      return { previous };
    },

    onSuccess: (data) => {
      toast.success(data.message); 
    },

    onError: (err, _postId, context) => {
      // Put everything back the way it was
      if (context) {
        queryClient.setQueryData(["newsfeed"], context.previous.newsfeed);
        queryClient.setQueryData(["userPosts"], context.previous.userPosts);
        queryClient.setQueryData(["savedPosts"], context.previous.savedPosts);
      }
      toast.error(err.message || "Something went wrong while updating the like.");
    },
  });
}