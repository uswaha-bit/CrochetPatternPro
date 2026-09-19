import { ErrorHandler } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";
import { User } from "../modules/user.js";
import {config} from "../config/env.js";
const isAuthenticatedUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("login first to access this resource");
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = await User.findById({ _id: decoded.id });

    next();
  } catch (error) {
    if (error.message === "login first to access this resource") {
      return next(new ErrorHandler(error.message, 401));
    }
    if (error.message === "user verification failed") {
      return next(new ErrorHandler(error.message, 404));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ErrorHandler("Invalid token, please log in again", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ErrorHandler("Token expired, please log in again", 401));
    }
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
export { isAuthenticatedUser, authorizeRoles };
