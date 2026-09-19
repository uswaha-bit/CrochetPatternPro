import {BASE_URL} from '../config'
export async function createPost(data) {
  const res = await fetch(`${BASE_URL}/user/post`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function getAllPosts() {
  const res = await fetch(`${BASE_URL}/user/post/all`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/user/post/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function getSavedPosts() {
  const res = await fetch(`${BASE_URL}/user/post/saved`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function savePost(id) {
  const res = await fetch(`${BASE_URL}/user/post/save/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      // Add any other required headers
    },
  });
  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  return result;
}

export async function getRecommendation({ page }) {
  const res = await fetch(
    `${BASE_URL}/user/post/newsfeed/?page=${page}&limit=10`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }
  const result = await res.json();
  console.log("these are recommneded posts", result);
  return result;
}

export async function getSuggestedUsers() {
  const res = await fetch(`${BASE_URL}/user/me/suggestedusers`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    console.log(err.error);
    throw new Error(err.error);
  }

  const result = await res.json();
  console.log("these are suggested users with order", result);
  return result;
}
export async function likePost(postId) {
  const res = await fetch(`${BASE_URL}/user/post/like/${postId}`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Error liking/unliking post:", err.error);
    throw new Error(err.error || "Failed to like/unlike post.");
  }

  const data = await res.json();
  return data; // { success: true, message: "post liked" | "post unliked" }
}
export async function savePostApi(postId) {
  const res = await fetch(`${BASE_URL}/user/post/save/${postId}`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Save post error:", data.error);
    throw new Error(data.error || "Failed to save post");
  }

  return data;
}
export const updatePostById = async ({ id, formData }) => {
  const response = await fetch(`${BASE_URL}/user/post/${id}`, {
    method: "POST",
    credentials: "include", // required for cookie-based auth
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update post");
  }

  const data = await response.json();
  return data.post;
};

export const getPostById = async (postId) => {
  const response = await fetch(`${BASE_URL}/user/post/${postId}`, {
    method: "GET",
    credentials: "include", // needed if your auth uses cookies
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch post");
  }

  const data = await response.json();
  return data.post;
};
