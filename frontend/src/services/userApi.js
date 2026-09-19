import {BASE_URL} from '../config'
export async function register(data) {
  console.log(data);
  const response = await fetch(`${BASE_URL}/user/newRegister`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    console.log("error message", errData.error);
    throw new Error(errData.error);
  }

  const res = await response.json();
  return res;
}

export async function update(data) {
  // const form = new FormData();
  // if (data.profileImage) {
  //   console.log(data.profileImage);
  //   form.append("profileImage", data.profileImage);
  // }
  // if (data.coverImage) {
  //   console.log(data.coverImage);
  //   form.append("coverImage", data.coverImage);
  // }
  // form.append("name", data.name);
  // form.append("username", data.username);
  // form.append("email", data.email);
  // form.append("gender", data.gender);
  // form.append("dateOfBirth", data.dateOfBirth);
  // form.append("skillLevel", data.skillLevel);
  const response = await fetch(`${BASE_URL}/user/update`, {
    method: "PUT",
    credentials: "include",
    body: data,
  });
  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    console.log("error message", errData.error);
    throw new Error(errData.error);
  }

  const res = await response.json();
  return res;
}

export async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    console.log("error message", errData.error);
    throw new Error(errData.error);
  }

  const data = await response.json();
  return data;
}

export async function getLoggedInUser() {
  const response = await fetch(`${BASE_URL}/user/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);

    throw new Error(errData.message || "failed to get currenly logged in user");
  }
  const data = await response.json();
  return data.user;
}

export async function logout() {
  const response = await fetch(`${BASE_URL}/user/logout`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errData = await response.json();
    console.log(errData);
    throw new Error(errData.message || "failed to logout user");
  }
  const data = await response.json();
  return data;
}
