import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/postApi";
export function useGetPost(enabled = true) {
  const {
    isLoading,
    data: userPosts,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: getAllPosts,
    retry: false,
    enabled,
  });
  return { isLoading, userPosts, refetch, error };
}
