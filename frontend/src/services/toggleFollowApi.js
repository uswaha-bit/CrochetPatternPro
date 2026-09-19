import { BASE_URL } from "../config";
export const toggleFollowApi = async (userId) => {
  const response = await fetch(`${BASE_URL}/user/toggle-follow/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to toggle follow status");
  }

  return data;
};
