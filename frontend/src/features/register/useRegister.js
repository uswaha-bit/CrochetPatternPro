import { useMutation } from "@tanstack/react-query";
import { register as registerApi } from "../../services/userApi.js";
import { useNavigate } from "react-router-dom";

export function useRegister() {
  const navigate = useNavigate();
  const { mutate: register, isLoading } = useMutation({
    mutationFn: (data) => registerApi(data),
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });

  return { register, isLoading };
}
