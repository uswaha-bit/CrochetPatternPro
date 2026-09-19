import { Message } from "../modules/message.js";
import { User } from "../modules/user.js";
import { Chat } from "../modules/chat.js";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "../utils/errorhandler.js";

export const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  try {
    if (!content || !chatId) {
      throw new Error("invalid data passed");
    }

    let message = await Message.create({
      sender: req.user.id,
      content,
      chat: chatId,
      readBy: [req.user.id],
    });

    message = await message.populate("sender", "name email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.participants",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(chatId, { lastMessage: message });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message,
    });
  } catch (error) {
    if (error.message === "invalid data passed") {
      return next(new ErrorHandler(error.message, StatusCodes.CONFLICT));
    }
    return next(
      new ErrorHandler(
        error.message || "message creation failed",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.id })
      .populate("sender", "name email")
      .populate("chat");

    await Message.updateMany(
      {
        chat: req.params.id,
        readBy: { $ne: req.user.id },
      },
      {
        $push: { readBy: req.user.id },
      }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      messages,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const markMessagesRead = async (req, res, next) => {
  try {
    const result = await Message.updateMany(
      {
        chat: req.params.id,
        readBy: { $ne: req.user.id },
      },
      {
        $addToSet: {
          readBy: req.user.id,
        },
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        modified: result.nModified,
      },
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};
