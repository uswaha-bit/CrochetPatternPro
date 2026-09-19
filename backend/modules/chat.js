import mongoose from "mongoose";
import { ErrorHandler } from "../utils/errorhandler.js";

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.pre("save", function (next) {
  if (this.participants.length != 2) {
    return next(new ErrorHandler("converstions must have 2 members"));
  }
  this.updatedAt = Date.now();
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export { Chat };
