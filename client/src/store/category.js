import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "https://salameelectric.onrender.com/api/app";
const CACHE_KEY = "categories";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  lastSynced: null, // Track last server sync time

  setCategories: (categories) => {
    const timestamp = Date.now();
    set({ categories, lastSynced: timestamp });
    // Store both categories and the sync timestamp
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        data: categories,
        timestamp,
      })
    );
  },

  fetchCategories: async () => {
    const state = get();
    if (state.isLoading)
      return { success: false, message: "Fetch already in progress" };

    try {
      set({ isLoading: true });

      // Always fetch fresh data from server first
      const { data } = await axiosInstance.get("/");

      get().setCategories(data.data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      // If server fetch fails, try to use cached data
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data)) {
          set({ categories: data, isLoading: false });
          return { success: true, fromCache: true };
        }
      }

      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch categories",
      };
    }
  },

  createCategory: async (newCategory) => {
    if (!newCategory.get("name")) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const { data } = await axiosInstance.post("/create", newCategory);
      set((state) => ({
        categories: [...state.categories, data.data],
        lastSynced: Date.now(),
      }));
      return { success: true, message: "Category created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create category",
      };
    }
  },

  deleteCategory: async (cid) => {
    try {
      const { data } = await axiosInstance.delete(`/${cid}`);
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        categories: state.categories.filter((category) => category._id !== cid),
        lastSynced: Date.now(),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete category",
      };
    }
  },

  updateCategory: async (cid, updatedCategoryParts) => {
    try {
      const { data } = await axiosInstance.patch(
        `/${cid}`,
        updatedCategoryParts
      );
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        categories: state.categories.map((category) =>
          category._id === cid ? data.data : category
        ),
        lastSynced: Date.now(),
      }));
      return { success: true, message: "Category updated successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update category",
      };
    }
  },

  clearCache: () => {
    set({ categories: [], lastSynced: null });
    localStorage.removeItem(CACHE_KEY);
  },
}));
