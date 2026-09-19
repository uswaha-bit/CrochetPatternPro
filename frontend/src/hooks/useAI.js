
import { useMutation } from "@tanstack/react-query";
import { getChatReply } from "../services/chatApi";

export function useChatReply() {
  return useMutation({
    mutationFn: getChatReply,
  });
}
