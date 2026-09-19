import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../services/postApi";
import { toast } from "react-hot-toast";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => likePost(postId),
    onSuccess: (data) => {
      toast.success(data.message); // "post liked" or "post unliked"
      queryClient.invalidateQueries(["userPosts"]);
      queryClient.invalidateQueries(["savedPosts"]); 
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong while updating the like.");
    },
  });
}
