import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // Stores user information after login
      isAuthenticated: false, // Tracks if the user is authenticated
      loginError: null, // Tracks login errors
      isPrime: false,
      lastLogin: null, // Store the timestamp of the last login

      // Method to handle user login
      login: async ({ username, password }) => {
        if (!username || !password) {
          set({ loginError: "Username and password are required." });
          return { success: false, message: "Please provide valid credentials." };
        }

        try {
          const response = await fetch(`${import.meta.env.VITE_RENDERHOST_URL}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();

          if (!data.success) {
            set({ loginError: data.message });
            return { success: false, message: data.message };
          }

          const currentTimestamp = Date.now(); // Get the current timestamp
          set({
            user: data.data,
            isAuthenticated: true,
            loginError: null,
            isPrime: data.data.isPrime,
            lastLogin: currentTimestamp, // Set the login timestamp
          });

          return { success: true, message: "Login successful." };
        } catch (error) {
          set({ loginError: "An error occurred during login." });
          return { success: false, message: "An error occurred during login." };
        }
      },

      // Method to handle guest login
      guestLogin: () => {
        set({
          user: { username: "guest" },
          isAuthenticated: true,
          loginError: null,
          lastLogin: Date.now(), // Set the login timestamp for guest login
        });
        return { success: true, message: "Login as guest." };
      },

      // Method to handle user logout
      logout: () => {
        set({ user: null, isAuthenticated: false, loginError: null, lastLogin: null });
        localStorage.setItem("categories", {}); // Save to localStorage
      },

      // Method to check if the session has expired
      checkSession: () => {
        const currentTimestamp = Date.now();
        const sessionTimeout = 3600000; // 1 hour in milliseconds
        const lastLogin = get().lastLogin;

        if (lastLogin && currentTimestamp - lastLogin > sessionTimeout) {
          set({ user: null, isAuthenticated: false, loginError: null, lastLogin: null });
        }
      },

      // Clear errors
      clearError: () => {
        set({ loginError: null });
      },
    }),
    {
      name: "auth-storage", // Key in localStorage for persistence
    }
  )
);
