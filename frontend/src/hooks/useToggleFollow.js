import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFollowApi } from "../services/toggleFollowApi";
import { toast } from "react-hot-toast";

export function useToggleFollow() {
  const queryClient = useQueryClient();

  const {
    mutate: toggleFollow,
    isPending: isPendingFollow,
  } = useMutation({
    mutationFn: toggleFollowApi,
    onSuccess: (data) => {
      toast.success(data.message || "Follow status updated");
      queryClient.invalidateQueries(["newsfeed"]); 
      queryClient.invalidateQueries(["userSuggestions"]);
      queryClient.invalidateQueries(["user"]) 
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update follow status");
    },
  });

  return { toggleFollow, isPendingFollow };
}
