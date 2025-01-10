import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "https://salameelectric.onrender.com/api/app/offers";
const CACHE_KEY = "offers";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const useOfferStore = create((set, get) => ({
  offers: [],
  isLoading: false,
  lastSynced: null,

  setOffers: (offers) => {
    const timestamp = Date.now();
    set({ offers, lastSynced: timestamp });
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: offers, timestamp })
    );
  },

  fetchOffers: async () => {
    const state = get();
    if (state.isLoading)
      return { success: false, message: "Fetch already in progress" };

    try {
      set({ isLoading: true });
      const { data } = await axiosInstance.get("/");
      get().setOffers(data.data);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        if (Array.isArray(data)) {
          set({ offers: data, isLoading: false });
          return { success: true, fromCache: true };
        }
      }

      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch offers",
      };
    }
  },

  createOffer: async (newOffer) => {
    if (newOffer.get("items").length === 0) {
      return { success: false, message: "Please fill in all fields." };
    }

    try {
      const { data } = await axiosInstance.post("/create", newOffer);
      set((state) => ({
        offers: [...state.offers, data.data],
        lastSynced: Date.now(),
      }));
      return { success: true, message: "Offer created successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create offer",
      };
    }
  },

  deleteOffer: async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/${id}`);
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        offers: state.offers.filter((offer) => offer._id !== id),
        lastSynced: Date.now(),
      }));
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete offer",
      };
    }
  },

  updateOffer: async (id, updatedOfferParts) => {
    try {
      const { data } = await axiosInstance.patch(`/${id}`, updatedOfferParts);
      if (!data.success) return { success: false, message: data.message };

      set((state) => ({
        offers: state.offers.map((offer) =>
          offer._id === id ? data.data : offer
        ),
        lastSynced: Date.now(),
      }));
      return { success: true, message: "Offer updated successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update offer",
      };
    }
  },

  clearCache: () => {
    set({ offers: [], lastSynced: null });
    localStorage.removeItem(CACHE_KEY);
  },
}));
