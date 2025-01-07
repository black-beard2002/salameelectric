import { create } from "zustand";

export const useOfferStore = create((set) => ({
  offers: JSON.parse(localStorage.getItem("offers")) || [],
  setOffers: (offers) => {
    set({ offers });
    localStorage.setItem("offers", JSON.stringify(offers)); // Save to localStorage
  },
  createOffer: async (newOffer) => {
    console.log(newOffer)
    if  (newOffer.items.length===0) {
      return { success: false, message: "Please fill in all fields." };
    }
    
    const res = await fetch(`${import.meta.env.VITE_RENDERHOST_URL}/api/app/offers/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOffer),
      // mode: 'no-cors',
    });
    const data = await res.json();
    set((state) => {
      const newOffers = [...state.offers, data.data];
      localStorage.setItem("offers", JSON.stringify(newOffers)); // Save to localStorage
      return { offers: newOffers };
    });
    return { success: true, message: "offer created successfully" };
  },
  fetchOffers: async () => {
    const res = await fetch(`${import.meta.env.VITE_RENDERHOST_URL}/api/app/offers`,{
      // mode: 'no-cors',
    });
    const data = await res.json(); // data={success:"",data}
    set({ offers: data.data });
    localStorage.setItem("offers", JSON.stringify(data.data)); // Save to localStorage
  },
  deleteOffer: async (id) => {
    const res = await fetch(`${import.meta.env.VITE_RENDERHOST_URL}/api/app/offers/${id}`, {
      method: "DELETE",
      // mode: 'no-cors',
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    set((state) => {
      const updatedOffers = state.offers.filter((offer) => offer._id !== id);
      localStorage.setItem("offers", JSON.stringify(updatedOffers)); // Save to localStorage
      return { offers: updatedOffers };
    });
    return { success: true, message: data.message };
  },
}));
