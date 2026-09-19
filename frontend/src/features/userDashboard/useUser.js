import { useQuery } from "@tanstack/react-query";
import { getLoggedInUser } from "../../services/userApi";
export function useUser() {
  const {
    isLoading,
    data: user,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getLoggedInUser,

    //prevent automatic fetching on component mounts
  });

  return { isLoading, user, error, refetch };
}
