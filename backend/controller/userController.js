import { StatusCodes } from "http-status-codes";
import { User } from "../modules/user.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
import crypto from "crypto";
import mongoose from "mongoose";
import sharp from "sharp";
import {
  deleteImage,
  getImage,
  uploadImage,
} from "../utils/s3BucketCommands.js";
import { config } from "../config/env.js";

export const registerUser = async (req, res, next) => {
  const newuser = new User({
    name: req.body.name,
    username: req.body.username,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
    dateOfBirth: req.body.dateOfBirth,
    skillLevel: req.body.skillLevel,
  });

  try {
    await newuser.save();
    sendToken(newuser, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    res.staus(400).json({ message: "problem finding users", error });
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginuser = await User.findOne({ email }).select("+password");
    if (!loginuser) {
      throw new Error("invalid user");
    }
    const isPasswordMatched = await loginuser.comparePassword(password);
    if (!isPasswordMatched) {
      throw new Error("invalid credentials");
    }
    sendToken(loginuser, 200, res);
  } catch (error) {
    if (error.message === "invalid user")
      return next(new ErrorHandler(error.message, 404));
    if (error.message === "invalid credentials")
      return next(new ErrorHandler(error.message), 401);
    return next(
      new ErrorHandler("An unexpected error occurred: " + error.message, 500)
    );
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorHandler("User not found", 404));

    // TODO: re-enable when AWS credentials are available.
    // Generates fresh pre-signed URLs per request (never saved to the DB).
    //
    // const withUrl = async (image) =>
    //   image?.name
    //     ? {
    //         ...image,
    //         url: await getImage({ Bucket: config.aws.bucket, Key: image.name }),
    //       }
    //     : image;
    //
    // const userData = user.toObject();
    // const [profileImage, coverImage] = await Promise.all([
    //   withUrl(userData.profileImage),
    //   withUrl(userData.coverImage),
    // ]);
    // return res.status(200).json({
    //   success: true,
    //   user: { ...userData, profileImage, coverImage },
    // });

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "logged out",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 404));
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("user not found with this email");
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //generate reset url

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nif you have not requested this then ignore it`;

    try {
      await sendEmail({
        email: user.email,
        subject: "mybookshelf password recovery",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to: ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpireDate = undefined;

      return next(ErrorHandler(error.message, 500));
    }
  } catch (error) {
    if (error.message === "user not found with this email") {
      return next(new ErrorHandler(error.message, 404));
    }
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    //hash url token and compare it with hashed resettoken sotred in db
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpireDate: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("password reset token is invalid or has been expired");
    }

    if (req.body.password !== req.body.confirmPassword) {
      throw new Error("password does not match");
    }

    user.password = req.body.password;
    user.resetPasswordExpireDate = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    if (
      error.message === "password reset token is invalid or has been expired"
    ) {
      return next(new ErrorHandler(error.message, 404));
    }
    if (error.message === "password does not match") {
      return next(new ErrorHandler(error.message, 404));
    }
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const deluser = await User.deleteOne({ _id: req.params.id });
    if (deluser.deletedCount === 0) {
      throw new Error("user not found");
    }

    res.status(200).json({
      success: true,
      message: "user deleted",
    });
  } catch (error) {
    if (error.message === "user not found") {
      return next(new ErrorHandler(error.message, 404));
    }
  }
};

export const updateUser = async (req, res, next) => {
  const updates = req.body;
  const image = req.files["coverImage"]?.[0];
  const pimage = req.files["profileImage"]?.[0];
  // console.log(pimage);

  try {
    //if profile image exists than upload that image to the aws s3 bucket
    if (pimage) {
      updates.profileImage = {
        name: pimage.originalname,
        mimetype: pimage.mimetype,
      };

      const resizedProfileImage = await sharp(pimage.buffer)
        .resize({
          width: 135,
          height: 135,
          fit: sharp.fit.contain, // Maintain aspect ratio with cropping
        })
        .png()
        .toBuffer();

      try {
        const profileImageParams = {
          Bucket: config.aws.bucket,
          Key: pimage.originalname,
          Body: resizedProfileImage,
          ContentType: "image/png",
        };
        updates.profileImage.mimetype = "image/png";
        await uploadImage(profileImageParams);

        const getProfileImageParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: pimage.originalname,
        };
        const p_url = await getImage(getProfileImageParams);
        updates.profileImage.url = p_url;

        // console.log(uploadImage);
      } catch (error) {
        return next(new ErrorHandler(error.message, 404));
      }
    } else {
      //if the field name is there but the field is empty get name from the mongodb and delete the image from the aws s3 bucket
      try {
        // const userToUpdate = await User.findById(req.user.id);
        // if (userToUpdate.profileImage.name) {
        //   const deleteObjectParam = {
        //     Bucket: process.env.AWS_S3_BUCKET_NAME,
        //     Key: userToUpdate.profileImage.name,
        //   };
        //   await deleteImage(deleteObjectParam);
        //   userToUpdate.profileImage = {};
        //   await userToUpdate.save();
        // }
      } catch (error) {
        return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
      }
    }

    if (image) {
      //if cover image exists than upload that image to the aws s3 bucket
      updates.coverImage = {
        name: image.originalname,
        mimetype: image.mimetype,
      };

      const resizedCoverImage = await sharp(image.buffer)
        .resize({
          width: 850,
          height: 150,
          fit: sharp.fit.contain, // Maintain aspect ratio with cropping
        })
        .jpeg({ quality: 90 })
        .toBuffer();

      try {
        const coverImageParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: image.originalname,
          Body: resizedCoverImage,
          ContentType: "image/jpeg",
        };
        updates.coverImage.mimetype = "image/jpeg";
        await uploadImage(coverImageParams);

        const getCoverImageParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: image.originalname,
        };
        const c_url = await getImage(getCoverImageParams);
        updates.coverImage.url = c_url;
      } catch (error) {
        return next(new ErrorHandler(error.message, 404));
      }
    }
    // else {
    //   //if the field name is there but the field is empty get name from the mongodb and delete the image from the aws s3 bucket
    //   try {
    //     const userToUpdate = await User.findById(req.user.id);
    //     if (userToUpdate.coverImage.name) {
    //       const deleteObjectParam = {
    //         Bucket: process.env.AWS_S3_BUCKET_NAME,
    //         Key: userToUpdate.coverImage.name,
    //       };

    //       await deleteImage(deleteObjectParam);
    //       userToUpdate.coverImage = {};
    //       await userToUpdate.save();
    //     }
    //   } catch (error) {
    //     return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    //   }
    // }

    if (!pimage && "profileImage" in updates) {
      delete updates.profileImage;
    }
    if (!image && "coverImage" in updates) {
      delete updates.coverImage;
    }
    const user = await User.findByIdAndUpdate({ _id: req.user.id }, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw new Error("user not found,invalid ID");
    }
    if (!updates) {
      throw new Error("no updates provided");
    }

    res.status(201).json({
      success: true,
      message: "user successfuly updated",
      user,
    });
  } catch (error) {
    if (error.message === "user not found,invalid ID") {
      return next(new ErrorHandler(error.message, 404));
    }
    if (error.message === "no updates provided") {
      return next(new ErrorHandler(error.message, 400));
    }

    return next(new ErrorHandler(error.message || "something went wrong", 500));
  }
};

export const toggleFollowUser = async (req, res, next) => {
  const userId = req.user.id;
  const targetUserId = req.params.id;

  try {
    if (!userId) {
      throw new Error("unauthorized access");
    }

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      throw new Error("invalid target user id format");
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser) {
      throw new Error("can not find current user");
    }
    if (!targetUser) {
      throw new Error("target user not found");
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(userId);
      await currentUser.save();
      await targetUser.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "User unfollowed successfully",
        followed: false,
      });
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(userId);
      await currentUser.save();
      await targetUser.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "User followed successfully",
        followed: true,
      });
    }
  } catch (error) {
    const code =
      error.message === "unauthorized access"
        ? StatusCodes.UNAUTHORIZED
        : error.message.includes("not found") ||
          error.message.includes("can not")
        ? StatusCodes.NOT_FOUND
        : error.message.includes("format")
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR;

    return next(new ErrorHandler(error.message, code));
  }
};

export const getSuggestedUsers = async (req, res, next) => {
  const userId = req.user.id;
  try {
    if (!userId) {
      throw new Error("unauthorized to access this resource");
    }

    const loggedInUser = await User.findById(userId);
    const loggedInUserSkillLevel = loggedInUser.skillLevel;
    console.log(loggedInUserSkillLevel);
    const suggestedUsers = await User.find({ _id: { $ne: userId } }).select(
      "name skillLevel profileImage"
    );

    suggestedUsers.sort((a, b) => {
      const aKey =
        a.skillLevel === loggedInUserSkillLevel
          ? 0
          : a.skillLevel > loggedInUserSkillLevel
          ? 1
          : -1;
      const bKey =
        b.skillLevel === loggedInUserSkillLevel
          ? 0
          : b.skillLevel > loggedInUserSkillLevel
          ? 1
          : -1;

      if (aKey !== bKey) return bKey - aKey;
      return (
        Math.abs(a.skillLevel - loggedInUserSkillLevel) -
        Math.abs(b.skillLevel - loggedInUserSkillLevel)
      );
    });

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "here are suggested users",
      suggestedUsers,
    });
  } catch (error) {
    if (error.message === "unauthorized") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }

    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};
