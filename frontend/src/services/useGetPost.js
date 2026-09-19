import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../services/postApi"; // update path as needed

export function useGetPost(postId) {

  const {
    isLoading,
    data: post,
    error,
    refetch,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: getPostById(postId),
    staleTime: 1000 * 60 * 5,
  });

  return { isLoading, post, error, refetch };
}
