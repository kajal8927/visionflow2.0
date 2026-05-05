import api from "./api.js";

const TOKEN_KEY = "visionflow_token";
const USER_KEY = "visionflow_user";

export const saveAuthData = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    clearAuthData();
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });

    const token = response.data?.token;
    const user = response.data?.user;

    if (!token || !user) {
      throw new Error("Invalid backend response");
    }

    saveAuthData(token, user);

    return {
      success: true,
      token,
      user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Invalid email or password.",
    };
  }
};

export const registerUser = async (formData) => {
  try {
    await api.post("/auth/register", formData);

    return {
      success: true,
      message: "Account created successfully. Please login to continue.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed. Please try again.",
    };
  }
};

export const logoutUser = () => {
  clearAuthData();

  return {
    success: true,
  };
};