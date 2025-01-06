import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Stores user information after login
      isAuthenticated: false, // Tracks if the user is authenticated
      loginError: null, // Tracks login errors
      isPrime: false,

      // Method to handle user login
      login: async ({ username, password }) => {
        if (!username || !password) {
          set({ loginError: "Username and password are required." });
          return {
            success: false,
            message: "Please provide valid credentials.",
          };
        }
        try {
          const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });
          const data = await response.json();
          if (!data.success) {
            set({ loginError: data.message });
            return { success: false, message: data.message };
          }

          set({
            user: data.data,
            isAuthenticated: true,
            loginError: null,
            isPrime: data.data.isPrime,
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
        });
        return { success: true, message: "Login as guest." };
      },

      // Method to handle user logout
      logout: () => {
        set({ user: null, isAuthenticated: false, loginError: null });
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
