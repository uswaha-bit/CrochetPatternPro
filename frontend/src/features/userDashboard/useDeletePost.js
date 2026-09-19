import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost as deletePostApi } from "../../services/postApi";

// useDeletePost.js
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id) => deletePostApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["savedPosts"] });
    },
  });

  return { mutate, isPending }; 
};
