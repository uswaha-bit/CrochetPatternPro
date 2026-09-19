import { useMutation } from "@tanstack/react-query";
import { updatePostById } from "../services/postApi";

export function useUpdatePost() {
  return useMutation({
    mutationFn: ({ id, formData }) => updatePostById({ id, formData }),
  });
}
