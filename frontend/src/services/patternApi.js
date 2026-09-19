import {BASE_URL} from '../config'  
export async function createPattern(patternData) {
  console.log(patternData);
  const res = await fetch(`${BASE_URL}/patterns`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patternData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create pattern");
  }

  return res.json();
}
export async function getPatterns() {
  const res = await fetch(`${BASE_URL}/patterns`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch patterns");
  }

  const data = await res.json();
  return data.patterns;
}
export async function getPatternById(id) {
  const res = await fetch(`${BASE_URL}/patterns/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch pattern");
  }

  const data = await res.json();
  return data.pattern;
}
export async function deletePatternById(id) {
  const res = await fetch(`${BASE_URL}/patterns/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete pattern");
  }

  return true;
}

export async function savePatternImage(data) {
  const res = await fetch(`${BASE_URL}/patterns/save`, {
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
