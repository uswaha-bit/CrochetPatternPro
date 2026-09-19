import { StatusCodes } from "http-status-codes";
import { Chat } from "../modules/chat.js";
import { User } from "../modules/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";

export const getChats = async (req, res, next) => {
  const userId = req.user.id;
  try {
    let chats = await Chat.find({
      participants: { $elemMatch: { $eq: userId } },
    })
      .populate({ path: "participants", select: "name email" })
      .populate({
        path: "lastMessage",
        select: "content sender readBy createdAt",
      })
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "lastMessage.sender",
      select: "name email",
    });

    res.status(StatusCodes.OK).json({
      success: true,
      chats,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        error.message || "error in getting all chats",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const accessChat = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) {
      throw new Error("user id not sent with the request");
    }

    let chat = await Chat.find({
      $and: [
        { participants: { $elemMatch: { $eq: req.user.id } } },
        { participants: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate({ path: "participants", select: "name email" })
      .populate({
        path: "lastMessage",
        select: "content sender readBy createdAt",
      })
      .sort({ updatedAt: -1 });

    chat = await User.populate(chat, {
      path: "lastMessage.sender",
      select: "name email",
    });

    if (chat.length > 0) {
      res.status(StatusCodes.OK).json({
        success: true,
        data: chat[0],
      });
    } else {
      //creating new chat
      const newChat = await Chat.create({
        participants: [req.user.id, userId],
      });

      const fullChat = await Chat.findOne({ _id: newChat._id }).populate({
        path: "participants",
        select: "name email",
      });

      res.status(StatusCodes.OK).json({
        success: true,
        fullChat,
      });
    }
  } catch (error) {
    if (error.message === "user id not sent with the request") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};
