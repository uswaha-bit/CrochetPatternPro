import { Server as socketIO } from "socket.io";
import { ErrorHandler } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";
import { User } from "../modules/user.js";
import { StatusCodes } from "http-status-codes";
import { IoAccessibility } from "react-icons/io5";

const configureSocket = (server) => {
  const io = new socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  //socket middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("authentication error");
      }

      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = await User.findById(decoded.id);
      if (!socket.user) {
        throw new Error("user not found");
      }

      socket.userId = socket.user._id.toString();
      next();
    } catch (error) {
      if (error.message === "authentication error") {
        return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
      }
      if (error.message === "user not found") {
        return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
      }
      return next(
        new ErrorHandler(
          error.message || "internal server error",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  });

  //socket event handler definitions
  io.on("connection", (socket) => {
    console.log(
      `user connected: ${socket.user._id} and socket id: ${socket.id}`
    );

    //user joins their own room based on userId
    socket.join(socket.userId);
    socket.emit("connected");

    //setup user as online
    socket.broadcast.emit("user online", socket.userId);

    //new message
    socket.on("new message", (messageData) => {
      //console.log(messageData.data.content);
      let senderId = socket.userId;
      let recipientId = messageData.data.chat.participants.find(
        (user) => user._id.toString() !== socket.userId
      );

      // If recipient is an object, extract the ID
      if (typeof recipientId === "object" && recipientId._id) {
        recipientId = recipientId._id.toString();
      }

      if (recipientId) {
        console.log(`Sending message from ${senderId} to ${recipientId}`);
        socket.to(recipientId).emit("message received", messageData);
      }
    });

    //typing indicator
    socket.on("typing", (chatId, recipientId) => {
      if (recipientId) {
        socket.to(recipientId).emit("typing", {
          user: socket.user._id,
          chatId,
        });
      }
    });

    //stop typing indicator
    socket.on("stop typing", (chatId, recipientId) => {
      if (recipientId) {
        socket.to(recipientId).emit("stop typing", {
          user: socket.user_id,
          chatId,
        });
      }
    });

    //on disconnect
    socket.on("disconnect", () => {
      console.log(`user disconnected: ${socket.user._id}`);
      socket.broadcast.emit("user offline", socket.user._id);
    });
  });

  return io;
};

export { configureSocket };
