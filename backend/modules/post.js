import mongoose from "mongoose";
import validator from "validator";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 6, max: 100 }),
      },
    },
    description: {
      type: String,
      maxLength: [1000, "description exceeded maximum limit"],
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    saves: [ // <-- New field to track saves
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        commentStr: {
          type: String,
          maxLength: [150],
          default: null,
        },
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: [
      {
        name: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
        mimetype: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export { Post };
