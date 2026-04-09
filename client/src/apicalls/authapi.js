import api from "../utils/axiosInstance";
import { toast } from "react-toastify";

// ==================== AUTHENTICATION APIs ====================

// ✅ 1. Send OTP
export const sendOtp = async (email, type) => {
  if (!email || !type) {
    toast.error("Email and type are required to send OTP");
    return { success: false };
  }

  try {
    const response = await api.post(`/auth/send-otp`, { email, type });

    if (response.data.success) {
      toast.success(response.data.message || "OTP sent successfully!");
      return {
        success: true,
        message: response.data.message,
        otpToken: response.data.otpToken,
      };
    } else {
      toast.error(response.data.message || "Failed to send OTP");
      return { success: false };
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    const message = error.response?.data?.message || error.message || "Failed to send OTP";
    toast.error(message);
    return { success: false };
  }
};

// ✅ 2. Verify OTP
export const verifyOtp = async (email, otp, type) => {
  if (!email || !otp || !type) {
    toast.error("Email, OTP, and type are required");
    return { success: false };
  }

  try {
    const response = await api.post(`/auth/verify-otp`, { email, otp, type });

    if (response.data.success) {
      toast.success(response.data.message || "OTP verified successfully");
      return {
        success: true,
        message: response.data.message,
        otpToken: response.data.otpToken,
      };
    } else {
      toast.error(response.data.message || "OTP verification failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    const message = error.response?.data?.message || error.message || "OTP verification failed";
    toast.error(message);
    return { success: false };
  }
};

// ✅ 3. Signup User
export const signup = async (userData) => {
  try {
    const response = await api.post(`/auth/signup`, userData);

    if (response.data.success) {
      toast.success(response.data.message || "User registered successfully!");

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } else {
      toast.error(response.data.message || "Signup failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Signup error:", error);
    const message = error.response?.data?.message || error.message || "Signup failed";
    toast.error(message);
    return { success: false };
  }
};

// ✅ 4. Login User
export const login = async (email, password) => {
  try {
    const response = await api.post(`/auth/login`, { email, password });

    if (response.data.success) {
      toast.success(response.data.message || "Login successful!");

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } else {
      toast.error(response.data.message || "Login failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Login error:", error);
    const message = error.response?.data?.message || error.message || "Login failed";
    toast.error(message);
    return { success: false };
  }
};

// ✅ 5. Reset Password
export const resetPassword = async (email, password, otpToken) => {
  try {
    const response = await api.post(`/auth/reset-password`, { email, password, otpToken });

    if (response.data.success) {
      toast.success(response.data.message || "Password reset successful!");

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return {
        success: true,
        token: response.data.token,
        user: response.data.user,
      };
    } else {
      toast.error(response.data.message || "Password reset failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Reset password error:", error);
    const message = error.response?.data?.message || error.message || "Password reset failed";
    toast.error(message);
    return { success: false };
  }
};

// ✅ 6. Get User Profile (Protected)
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to view profile");
    return { success: false };
  }

  try {
    const response = await api.get(`/auth/profile`);

    if (response.data.success) {
      return {
        success: true,
        user: response.data.user,
      };
    } else {
      toast.error(response.data.message || "Failed to fetch profile");
      return { success: false };
    }
  } catch (error) {
    console.error("Get profile error:", error);
    const message = error.response?.data?.message || error.message;

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
    } else {
      toast.error(message);
    }
    return { success: false };
  }
};

// ✅ 7. Update User Profile (Protected)
export const updateProfile = async (name, phone_number) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to update profile");
    return { success: false };
  }

  try {
    const response = await api.put(`/auth/profile`, { name, phone_number });

    if (response.data.success) {
      toast.success(response.data.message || "Profile updated successfully!");
      return {
        success: true,
        user: response.data.user,
      };
    } else {
      toast.error(response.data.message || "Profile update failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Update profile error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return { success: false };
  }
};

// ✅ 8. Change Password (Protected)
export const changePassword = async (current_password, new_password) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("You must be logged in to change password");
    return { success: false };
  }

  try {
    const response = await api.put(`/auth/change-password`, { current_password, new_password });

    if (response.data.success) {
      toast.success(response.data.message || "Password changed successfully!");
      return { success: true };
    } else {
      toast.error(response.data.message || "Password change failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Change password error:", error);
    const message = error.response?.data?.message || error.message;
    toast.error(message);
    return { success: false };
  }
};

// ✅ 9. Logout
export const logout = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully!");
  return { success: true };
};

// ✅ 10. Refresh Token (Protected)
export const refreshToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return { success: false };
  }

  try {
    const response = await api.post(`/auth/refresh-token`);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      return {
        success: true,
        token: response.data.token,
      };
    } else {
      localStorage.removeItem("token");
      return { success: false };
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    localStorage.removeItem("token");
    return { success: false };
  }
};