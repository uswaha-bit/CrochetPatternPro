import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config/env.js";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxLength: [30],
  },
  username: {
    type: String,
    maxLength: 30,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: {
      values: ["male", "female"],
    },
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "invalid email",
    },
    lowercase: true,
  },
  dateOfBirth: {
    type: Date,
  },
  password: {
    type: String,
    require: [true, "password is required"],
    minLength: [8, "password must be above 8 characters"],
    select: false,
  },
  role: {
    type: String,
    requierd: true,
    default: "user",
  },
  skillLevel: {
    type: String,
    required: true,
    enum: {
      values: ["beginner", "intermediate", "advance"],
    },
  },
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default: null,
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  profileImage: {
    name: {
      type: String,
      //require: true,
      default: null,
    },
    url: {
      type: String,
      //require: true,
      default: null,
    },
    data: {
      type: Buffer,
      select: false,
    },
    mimetype: {
      type: String,
      default: null,
    },
  },
  coverImage: {
    name: {
      type: String,
      //require: true,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    data: {
      type: Buffer,
      select: false,
    },
    mimetype: {
      type: String,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpireDate: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("Error comparing password:", error);
  }
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  ///hash and set to reset password token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpireDate = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export { User };
