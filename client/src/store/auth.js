import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";
const AUTH_STORAGE_KEY = "authState";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in ms

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isPrime: false,
  loginError: null,
  isLoading: false,

  checkAuthState: async () => {
    try {
      const storedState = localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedState) {
        set({ isAuthenticated: false });
        return false;
      }

      const { user, timestamp } = JSON.parse(storedState);
      const isSessionValid = Date.now() - timestamp < SESSION_DURATION;

      if (!isSessionValid) {
        get().logout();
        return false;
      }

      set({
        user,
        isAuthenticated: true,
        isPrime: user.isPrime,
      });

      return true;
    } catch (error) {
      console.error("Auth state initialization error:", error);
      get().logout();
      return false;
    }
  },

  login: async ({ username, password }) => {
    if (get().isLoading)
      return { success: false, message: "Login in progress" };

    if (!username?.trim() || !password?.trim()) {
      set({ loginError: "Username and password are required." });
      return { success: false, message: "Please provide valid credentials." };
    }

    try {
      set({ isLoading: true, loginError: null });

      const { data } = await api.post("/login", { username, password });

      if (!data.success) {
        set({ loginError: data.message, isLoading: false });
        return { success: false, message: data.message };
      }

      const authState = {
        user: data.data,
        timestamp: Date.now(),
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));

      set({
        user: data.data,
        isAuthenticated: true,
        isPrime: data.data.isPrime,
        loginError: null,
        isLoading: false,
      });

      return { success: true, message: "Login successful" };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      set({
        loginError: errorMessage,
        isLoading: false,
      });
      return { success: false, message: errorMessage };
    }
  },

  logout: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      user: null,
      isAuthenticated: false,
      isPrime: false,
      loginError: null,
    });
  },

  clearError: () => set({ loginError: null }),
}));

// Add request interceptor for auth headers
api.interceptors.request.use((config) => {
  const authState = localStorage.getItem(AUTH_STORAGE_KEY);
  if (authState) {
    const { user } = JSON.parse(authState);
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
});

export default useAuthStore;
