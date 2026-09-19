import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import {
  sendMessage,
  getMessages,
  markMessagesRead,
} from "../controller/messageController.js";
const router = express.Router();

router.route("/user/chat/:id").post(isAuthenticatedUser, sendMessage);

router.route("/user/chat/:id").get(isAuthenticatedUser, getMessages);

router.route("/user/chat/read/:id").put(isAuthenticatedUser, markMessagesRead);

export default router;
