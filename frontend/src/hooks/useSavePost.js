import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePostApi } from "../services/postApi";
import { toast } from "react-hot-toast";

export function useSavePost() {
    
   const queryClient = useQueryClient();
  const { mutate: savePost, isPending : isPendingSaving } = useMutation({
    mutationFn: savePostApi,
    onSuccess: (data) => {
      toast.success(data.message || "Post saved!");
      queryClient.invalidateQueries(["userPosts"]);
      queryClient.invalidateQueries(["savedPosts"]); 
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save post.");
    },
  });

  return { savePost, isPendingSaving };
}
