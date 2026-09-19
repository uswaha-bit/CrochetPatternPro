import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login as loginApi } from "../../services/userApi";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (response) => {
    queryClient.setQueryData(["token"], response.token);
    queryClient.invalidateQueries(["user"]);
    const userId = response.user._id;
    navigate(`/user/${userId}`, { replace: true });
  }

  });

  return { login, isLoading };
}
