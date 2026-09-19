import { Post } from "../modules/post.js";
import { User } from "../modules/user.js";
import NodeCache from "node-cache";

//initailizign redis client
const cache = new NodeCache({
  stdTTL: 1800,
  checkperiod: 600,
  useClones: false,
});

//cache Time To Live
const cache_TTL = {
  USER_OWN_POSTS: 1 * 60 * 60,
  USER_INTERACTIONS: 1 * 60 * 60,
  ALL_POSTS: 0.5 * 60 * 60,
  USER_SAVED_POSTS: 0.5 * 60 * 60,
  USER_PROFILE: 1 * 60 * 60,
};

//cahce key generators
const getCacheKey = {
  allPosts: () => "posts:all",
  userOwnPosts: (userId) => `user:${userId}:own_post`,
  userSavedPosts: (userId) => `user:${userId}:saved_post`,
  userInteractions: (userId) => `user:${userId}:interactions`,
  userProfile: (userId) => `user:${userId}:profile`,
};

//initializing post cache
export const initializePostCache = async () => {
  try {
    console.log("initilazing  post cache setting all posts in cache");
    const posts = await Post.find({})
      .populate("createdBy", "name profileImage skillLevel")
      .populate("comments.user", "name profileImage")
      .populate("likes.userId", "name")
      .populate("shares.userId", "name profileImage")
      .sort({ createdAt: -1 })
      .maxTimeMS(30000);

    cache.set(getCacheKey.allPosts(), posts, cache_TTL.ALL_POSTS);

    //indexing post by user for quick access
    const postByUser = [];
    posts.forEach((post) => {
      const userId = post.createdBy._id.toString();
      if (!postByUser[userId]) {
        postByUser[userId] = [];
      }
      postByUser[userId].push(post._id.toString());
    });

    //cache each users own post
    for (const [userId, userPosts] of Object.entries(postByUser)) {
      cache.set(
        getCacheKey.userOwnPosts(userId),
        userPosts,
        cache_TTL.USER_OWN_POSTS
      );
    }

    console.log(`Posts cache initialized with ${posts.length} posts`);
    return true;
  } catch (error) {
    console.log("failed to initialize post:", error);
    //throw new Error("failed to initialize post:" + error.messaage);
  }
};

//geting all posts from cache or db if not in cache
export const getPostFromCache = async () => {
  try {
    const cacheKey = getCacheKey.allPosts();
    let posts = cache.get(cacheKey);

    if (!posts) {
      console.log("cache miss - fetching posts from database");
      posts = await Post.find({})
        .populate("createdBy", "name profileImage skillLevel")
        .populate("comments.user", "name profileImage")
        .populate("likes.userId", "name")
        .populate("shares.userId", "name profileImage")
        .sort({ createdAt: -1 });

      cache.set(cacheKey, posts, cache_TTL.ALL_POSTS);
    }

    return posts;
  } catch (error) {
    console.log("error geting posts from cache", error);
    return [];
  }
};

//cache user own posts
const getUserOwnPostsFromCache = async (userId) => {
  try {
    const cacheKey = getCacheKey.userOwnPosts(userId);
    let userPosts = cache.get(cacheKey);

    if (!userPosts) {
      console.log(`cache miss - fetching user ${userId} posts from database`);
      const posts = await Post.find({ createdBy: userId }).select("_id");
      userPosts = posts.map((post) => post._id.toString());
      cache.set(cacheKey, userPosts, cache_TTL.USER_POSTS);
    }

    return userPosts;
  } catch (error) {
    console.error("Error getting user own posts from cache:", error);
    return [];
  }
};

//cahce user saved posts and get them
const getUserSavedPostsFromCache = async (userId) => {
  try {
    const cacheKey = getCacheKey.userSavedPosts(userId);
    let savedPost = cache.get(cacheKey);

    if (!savedPost) {
      console.log("cache miss for saved posts , hitting the db");
      const user = await User.findById(userId).select("savedPosts");
      savedPost = user?.savedPosts?.map((postId) => postId.toString()) || [];
      cache.set(cacheKey, savedPost, cache_TTL.USER_SAVED_POSTS);
    }

    return savedPost;
  } catch (error) {
    console.log("failed to get posts you saved" + error.messaage);
    return [];
  }
};

//calculating user interactions from cache
const calculateUserInteractionsFromCache = async (userId) => {
  try {
    const posts = await getPostFromCache();

    const interactions = {
      liked: [],
      commented: [],
      shared: [],
    };

    posts.forEach((post) => {
      const postId = post._id.toString();

      //check likes
      if (post.likes && post.likes.some((like) => like.toString() === userId)) {
        console.log(post.likes);
        interactions.liked.push(postId);
      }

      //check commnets
      if (
        post.comments &&
        post.comments.some((comment) => comment.user.toString() === userId)
      ) {
        interactions.commented.push(postId);
      }

      //check shares
      if (
        post.shares &&
        post.shares.some((share) => share.toString() === userId)
      ) {
        interactions.shared.push(postId);
      }
    });

    //seting userinteraction to cache
    cache.set(
      getCacheKey.userInteractions(userId),
      interactions,
      cache_TTL.USER_INTERACTIONS
    );
    console.log(interactions);
    return interactions;
  } catch (error) {
    console.error("Error calculating user interactions:", error);
    return { liked: [], commented: [], shared: [] };
  }
};

//getting user interaction from cache
const getUserInteractionsFromCache = async (userId) => {
  try {
    const cacheKey = getCacheKey.userInteractions(userId);
    let interactions = cache.get(cacheKey);

    if (!interactions) {
      interactions = await calculateUserInteractionsFromCache(userId);
    }
    return interactions;
  } catch (error) {
    console.error("Error getting user interactions from cache:", error);
    return { liked: [], commented: [], shared: [] };
  }
};

//generating user interctions
export const getUserInteractions = async (userId) => {
  try {
    const [ownPosts, savedPosts, interactions] = await Promise.all([
      getUserOwnPostsFromCache(userId),
      getUserSavedPostsFromCache(userId),
      getUserInteractionsFromCache(userId),
    ]);

    const allInteractedPosts = [
      ...ownPosts,
      ...savedPosts,
      ...interactions.liked,
      ...interactions.shared,
      ...interactions.commented,
    ];
    // console.log(allInteractedPosts);
    return [...new Set(allInteractedPosts)];
  } catch (error) {
    throw new Error("error fetching user interacted posts: " + error.message);
  }
};

export const addPostToCache = async (post) => {
  try {
    const allPosts = await getPostFromCache();
    allPosts.unshift(post);
    cache.set(getCacheKey.allPosts(), allPosts, cache_TTL.ALL_POSTS);
    const userId = post.createdBy._id.toString();
    const userOwnPosts = await getUserOwnPostsFromCache(userId);
    userOwnPosts.unshift(post._id.toString());
    cache.set(
      getCacheKey.userOwnPosts(),
      userOwnPosts,
      cache_TTL.USER_OWN_POSTS
    );
  } catch (error) {
    console.error("❌ Error adding post to cache:", error);
  }
};

export const invalidatePostCache = async () => {
  try {
    const cacheKey = getCacheKey.allPosts();
    const deleted = cache.del(cacheKey);
    console.log(`Posts cache invalidated: ${deleted}`);
  } catch (error) {
    console.error("Error invalidating posts cache:", error);
  }
};

export const invalidateUserInteractionsCache = async (userId) => {
  try {
    if (userId) {
      const userInteractionKey = getCacheKey.userInteractions(userId);
      cache.del(getCacheKey.userInteractions(userId));
      console.log("invalidated interactions from cache");

      const freshInteractions = await calculateUserInteractionsFromCache(
        userId
      );
      console.log(
        "recalculated the interactions for user id:",
        freshInteractions
      );
    } else {
      const keys = cache.keys();
      const interactionKeys = keys.filter((key) =>
        key.includes(":interactions")
      );
      cache.del(interactionKeys);
    }
  } catch (error) {
    console.error("error in invalidating interactions from cache:", error);
  }
};

export const updatePostCache = async (updatedPost) => {
  try {
    const allPosts = await getPostFromCache();
    const postIndex = allPosts.findIndex(
      (post) => post._id.toString() === updatedPost._id.toString()
    );
    if (postIndex !== -1) {
      allPosts[postIndex] = updatedPost;
      cache.set(getCacheKey.allPosts(), allPosts, cache_TTL.ALL_POSTS);

      invalidateUserInteractionsCache();
    }
  } catch (error) {
    console.error("❌ Error updating post in cache:", error);
  }
};

export const removePostFromCache = async (postId) => {
  try {
    const allPosts = await getAllPostsFromCache();
    const filteredPosts = allPosts.filter(
      (post) => post._id.toString() !== postId
    );

    cache.set(getCacheKey.allPosts(), filteredPosts, cache_TTL.ALL_POSTS);
    invalidateUserInteractionsCache();

    console.log("✅ Post removed from cache");
  } catch (error) {
    console.error("❌ Error removing post from cache:", error);
  }
};

// const getUserLikedPosts = async (userId) => {
//   try {
//     const likedPosts = await Post.find({ "likes.userId": userId }).select(
//       "_id"
//     );
//     return likedPosts.map((post) => post._id.toString());
//   } catch (error) {
//     throw new Error("failed to get posts you liked" + error.messaage);
//   }
// };

// const getUserCommentedPosts = async (userId) => {
//   try {
//     const commentedPosts = await Post.find({
//       "comments.userId": userId,
//     }).select("_id");
//     return commentedPosts.map((post) => post._id.toString());
//   } catch (error) {
//     throw new Error("failed to get posts you commented" + error.messaage);
//   }
// };

// const getUserSharedPosts = async (userId) => {
//   try {
//     const sharedPosts = await Post.find({
//       "shares.userId": userId,
//     }).select("_id");
//     return sharedPosts.map((post) => post._id.toString());
//   } catch (error) {
//     throw new Error("failed to get posts you shared" + error.messaage);
//   }
// };

// export const getUserInteractedPosts = async (userId) => {
//   try {
//     const [post, likedPosts, commentedPosts, sharedPosts, user] =
//       await Promise.all([
//         getOwnPosts(userId),
//         getUserLikedPosts(userId),
//         getUserCommentedPosts(userId),
//         getUserSharedPosts(userId),
//         getUserSavedPosts(userId),
//       ]);

//     // Combine all interacted post IDs and remove duplicates
//     const allInteractedPosts = [
//       ...post,
//       ...likedPosts,
//       ...commentedPosts,
//       ...sharedPosts,
//       ...user,
//     ];

//     return [...new Set(allInteractedPosts)];
//   } catch (error) {
//     throw new Error("error fetching user interacted posts" + error.message);
//   }
// };
