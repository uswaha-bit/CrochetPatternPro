import { Post } from "../modules/post.js";
import { ErrorHandler } from "../utils/errorhandler.js";
import { StatusCodes } from "http-status-codes";
import {
  getUserInteractions,
  getPostFromCache,
  invalidateUserInteractionsCache,
  invalidatePostCache,
  addPostToCache,
  updatePostCache,
  removePostFromCache,
} from "../utils/userInteractedPosts.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  uploadMultipleImages,
  deleteMultipleImages,
  getMultipleImages,
  getImage,
} from "../utils/s3BucketCommands.js";
import { User } from "../modules/user.js";
dotenv.config({ path: "backend/config/config.env" });

export const createPost = async (req, res, next) => {
  const data = req.body;
  const files = req.files;
  const user = req.user.id;
  data.createdBy = user;
  var allFiles = [];

  try {
    data.content = [];
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (files.postContent) {
      allFiles = [...files.postContent];
      files.postContent.forEach((element) => {
        data.content.push({
          name: element.originalname,
          mimetype: element.mimetype,
        });
      });
    }

    const newPost = new Post(data);
    await uploadMultipleImages(allFiles);
    await newPost.save();

    await addPostToCache(newPost);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "post successfuly created",
      newPost,
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    return next(
      new ErrorHandler(
        error.message || "failed to create new post",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const updatePost = async (req, res, next) => {
  const { title, description } = req.body;
  const data = { title, description };
  const files = req.files;
  const user = req.user.id;
  const postId = req.params.id;
  var allNewFiles = [];
  try {
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (files.postImages) {
      allNewFiles = [...files.postImages];
    }
    if (files.postVideos) {
      allNewFiles = [...files.postVideos];
    }
    const updatedPost = await Post.findById(req.params.id);
    const allExistingFiles = updatedPost.content;

    const filesToRemove = allExistingFiles.filter((existingFile) => {
      return !allNewFiles.some((newFile) => {
        return newFile.originalname === existingFile.name;
      });
    });

    const filesToAdd = allNewFiles.filter((newFile) => {
      return !allExistingFiles.some((existingFile) => {
        return existingFile.name === newFile.originalname;
      });
    });

    // console.log("files to remove: ", filesToRemove);
    // console.log("files to add: ", filesToAdd);

    await deleteMultipleImages(filesToRemove);
    await uploadMultipleImages(filesToAdd);

    if (filesToRemove.length > 0) {
      updatedPost.content = updatedPost.content.filter((file) => {
        !filesToRemove.includes(file.name);
      });
    }

    if (filesToAdd.length > 0) {
      filesToAdd.forEach((file) => {
        updatedPost.content.push({
          name: file.originalname,
          url: null,
          mimetype: file.mimetype,
        });
      });
    }

    await updatedPost.save();
    const post = await Post.findByIdAndUpdate({ _id: req.params.id }, data, {
      new: true,
      runValidators: true,
    });
    await updatePostCache(post);
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("invalid post id format");
    }
    if (!updatedPost) {
      throw new Error("post can't be found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      messaage: "post updated successfully",
      post,
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "invalid post id format") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    if (error.message === "post can't be found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(error.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

export const getPost = async (req, res, next) => {
  const user = req.user.id;
  const postToGet = req.params.id;
  try {
    if (!user) {
      throw new Error("unauthrized access");
    }
    const post = await Post.findOne({
      _id: postToGet,
    });
    if (!post) {
      throw new Error("post not found");
    }
    const allFiles = post.content;
    const { urls } = await getMultipleImages(allFiles);
    urls.forEach((url, index) => {
      // console.log(url);
      if (post.content[index]) {
        post.content[index].url = url;
      }
    });
    await post.save();
    res.status(StatusCodes.OK).json({
      success: true,
      post,
    });
  } catch (error) {
    if (error.message === "unauthrized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getAllPost = async (req, res, next) => {
  const user = new mongoose.Types.ObjectId(String(req.user.id));
  var flag = false;
  try {
    if (!user) {
      throw new Error("unauthrized access");
    }
    const posts = await Post.find({ createdBy: user });
    if (posts.length === 0) {
      throw new Error("no posts yet by user");
    }
    var allFiles = [];
    posts.forEach((post) => allFiles.push(...post.content));
    const { urls } = await getMultipleImages(allFiles);
    let index = 0;
    posts.forEach((post) => {
      post.content.forEach((content) => {
        if (content.name === allFiles[index].name) {
          content.url = urls[index];
          index++;
        }
      });
    });

    posts.forEach((post) => post.save());
    res.status(StatusCodes.OK).json({
      success: true,
      posts,
    });
  } catch (error) {
    if (error.message === "unauthrized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "no posts yet by user") {
      return next(new ErrorHandler(error.message, StatusCodes.OK));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const getNewsFeed = async (req, res, next) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  console.log("generating post for user");
  const [interactedPostIds, allPosts] = await Promise.all([
    getUserInteractions(userId),
    getPostFromCache(),
  ]);

  const allAvailablePosts = allPosts.filter((post) => {
    return !interactedPostIds.includes(post._id.toString());
  });

  // console.log("ainteractedPostIds", interactedPostIds);
  // console.log("allPosts", allPosts);
  // const interactedPosts = await getUserInteractedPosts(userId);
  // const newsFeed = await Post.find({
  //   _id: { $nin: interactedPosts },
  // })
  //   .populate("createdBy", "name profileImage skillLevel")
  //   .populate("comments.user", "name profileImage")
  //   .populate("likes.userId", "name")
  //   .populate("shares.userId", "name profileImage")
  //   .sort({ createdAt: -1 })
  //   .skip(skip)
  //   .limit(limit);

  // Get total count for pagination
  const paginatedPosts = allAvailablePosts.slice(skip, skip + limit);
  const totalPosts = allAvailablePosts.length;
  const hasMore = skip + paginatedPosts.length < totalPosts;

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      posts: allAvailablePosts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasMore,
        postsPerPage: limit,
      },
    },
    message: "Newsfeed posts fetched successfully",
  });
  try {
  } catch (error) {
    return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
  }
};

export const likePost = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    if (!userId) {
      throw new Error("unauthorized access and user not found");
    }
    if (!postId) {
      throw new Error("post id not found");
    }
    const postToLike = await Post.findOne({ _id: postId });
    if (!postToLike) {
      throw new Error("post not found");
    }
    const hasLiked = postToLike.likes.includes(userId);
    if (hasLiked) {
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
      await Promise.all([
        invalidatePostCache(),
        invalidateUserInteractionsCache(userId),
      ]);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "post unliked",
      });
    } else {
      await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      await Promise.all([
        invalidatePostCache(),
        invalidateUserInteractionsCache(userId),
      ]);
      res.status(StatusCodes.OK).json({
        success: true,
        message: "post liked",
      });
    }
  } catch (error) {
    if (error.message === "unauthorized access and user not found") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "post id not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    if (error.message === "post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export const savePost = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    if (!userId) throw new Error("unauthorized");
    if (!postId) throw new Error("no post id found to save it");

    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) throw new Error("user or post not found");

    const alreadySaved = user.savedPosts.includes(postId);

    if (alreadySaved) {
      // Remove post from user's saved list
      await User.findByIdAndUpdate(userId, {
        $pull: { savedPosts: postId },
      });

      // Remove user from post's saves list
      await Post.findByIdAndUpdate(postId, {
        $pull: { saves: userId },
      });

      await Promise.all([
        invalidatePostCache(),
        invalidateUserInteractionsCache(userId),
      ]);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "post unsaved",
      });
    } else {
      // Add post to user's saved list
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedPosts: postId },
      });

      // Add user to post's saves list
      await Post.findByIdAndUpdate(postId, {
        $addToSet: { saves: userId },
      });

      await Promise.all([
        invalidatePostCache(),
        invalidateUserInteractionsCache(userId),
      ]);

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "post saved",
      });
    }

  } catch (error) {
    if (error.message === "unauthorized") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "no post id found to save it") {
      return next(new ErrorHandler(error.message, StatusCodes.BAD_REQUEST));
    }
    if (error.message === "user or post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};


export const getSavedPosts = async (req, res, next) => {
  const userId = req.user.id;

  try {
    if (!userId) {
      throw new Error("unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const savedPostsIds = user.savedPosts;

    if (savedPostsIds.length > 0) {
      const savedPosts = await Post.find({ _id: { $in: savedPostsIds } })
        .populate({
          path: "createdBy",
          select: "name profileImage skillLevel",
        })
        .exec();

      res.status(StatusCodes.OK).json({
        success: true,
        message: "All saved posts",
        savedPosts,
      });
    } else {
      res.status(StatusCodes.OK).json({
        success: true,
        message: "No saved posts",
        savedPosts: [],
      });
    }
  } catch (error) {
    if (error.message === "unauthorized") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "user not found") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    return next(
      new ErrorHandler(
        error.message || "Internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};


export const deletePost = async (req, res, next) => {
  const user = req.user.id;
  try {
    const post = await Post.findById(req.params.id);

    // console.log(post.content);
    if (post.content) {
      const allFiles = post.content;
      await deleteMultipleImages(allFiles);
    }
    if (user != post.createdBy) {
      throw new Error("can not delete this post, unauhtorized access");
    }
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new Error("unauthorized access");
    }
    if (!result) {
      throw new Error("post not found");
    }
    await removePostFromCache(req.params.id);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "post deleted successfully",
    });
  } catch (error) {
    if (error.message === "unauthorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "can not delete this post, unauhtorized access") {
      return next(new ErrorHandler(error.message, StatusCodes.UNAUTHORIZED));
    }
    if (error.message === "post not found") {
      return next(new ErrorHandler(error.message, StatusCodes.NOT_FOUND));
    }
    return next(
      new ErrorHandler(
        error.message || "internal server error",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
