import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost as createPostApi } from "../../services/postApi";

export function useCreatePost() {
  const queryClient = useQueryClient();

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: (data) => createPostApi(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  return { createPost, isLoading };
}
