import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Default state when no persisted state exists.
const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Load persisted auth state from localStorage if available.
const loadAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("authState");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Error parsing authState from localStorage", err);
      }
    }
  }
  return defaultAuthState;
};

const initialState: AuthState = loadAuthState();

// Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData: { email: string; password: string; username: string }) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to sign up");
    }
    return response.json();
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to log in");
    }
    return response.json();
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to log out");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Optionally, add synchronous actions here.
  },
  extraReducers: (builder) => {
    builder
      // Signup handlers
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        // Note: you may choose to update state.user if signup also logs the user in.
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to sign up";
      })
      // Login handlers
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; // assuming response contains user data
        if (typeof window !== "undefined") {
          localStorage.setItem("authState", JSON.stringify(state));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to log in";
      })
      // Logout handler
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        if (typeof window !== "undefined") {
          localStorage.setItem("authState", JSON.stringify(state));
        }
      });
  },
});

export default authSlice.reducer;
