import { useQuery } from "@tanstack/react-query";
import { getSuggestedUsers } from "../../services/postApi";
export function useGetSuggestions(enabled = true) {
  const {
    isLoading,
    data: userSuggestions,
    error,
  } = useQuery({
    queryKey: ["userSuggestions"],
    queryFn: getSuggestedUsers,
    retry: false,
    enabled,
  });
  return { isLoading, userSuggestions, error };
}
