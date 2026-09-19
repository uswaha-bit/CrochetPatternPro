import { useMutation } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/userApi";
import { useNavigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      navigate("/", { replace: true });
    },
    onError: (err) => {
      console.log("error", err);
      //toast.error('provided email or password are incorrect)
    },
  });

  return { logout, isPending };
}
