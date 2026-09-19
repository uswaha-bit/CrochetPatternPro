import { useQuery } from "@tanstack/react-query";
import { getSavedPosts } from "../../services/postApi";

export function useGetSavedPost() {
  const {
    isLoading,
    data: savedPosts,
    error,
  } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: getSavedPosts,
    retry: false,
  });
  return { isLoading, savedPosts, error };
}
