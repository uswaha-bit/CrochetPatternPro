import express from "express";
import { isAuthenticatedUser } from "../middlewares/authentication.js";
import { accessChat, getChats } from "../controller/chatController.js";
const router = express.Router();

router.route("/user/chats/chat").post(isAuthenticatedUser, accessChat);
router.route("/user/chats").get(isAuthenticatedUser, getChats);

export default router;
