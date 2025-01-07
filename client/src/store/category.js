import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categories: JSON.parse(localStorage.getItem("categories")) || [], // Load categories from localStorage or use an empty array
  setCategories: (categories) => {
    set({ categories });
    localStorage.setItem("categories", JSON.stringify(categories)); // Save to localStorage
  },
  createCategory: async (newCategory) => {
    if (!newCategory.name || !newCategory.items) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch(process.env.HOST_URL+"/api/app/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    });
    const data = await res.json();
    set((state) => {
      const newCategories = [...state.categories, data.data];
      localStorage.setItem("categories", JSON.stringify(newCategories)); // Save to localStorage
      return { categories: newCategories };
    });
    return { success: true, message: "Category created successfully" };
  },
  fetchCategories: async () => {
    const res = await fetch(process.env.HOST_URL+"/api/app");
    const data = await res.json(); // data={success:"",data}
    set({ categories: data.data });
    localStorage.setItem("categories", JSON.stringify(data.data)); // Save to localStorage
  },
  deleteCategory: async (cid) => {
    const res = await fetch(`${process.env.HOST_URL}/api/app/${cid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the UI immediately, without needing a refresh
    set((state) => {
      const updatedCategories = state.categories.filter(
        (category) => category._id !== cid
      );
      localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save to localStorage
      return { categories: updatedCategories };
    });
    return { success: true, message: data.message };
  },
  updateCategory: async (cid, updatedCategory) => {
    const res = await fetch(`${process.env.HOST_URL}/api/app/${cid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
      
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    // update the UI immediately, without needing a refresh
    set((state) => {
      const updatedCategories = state.categories.map((category) =>
        category._id === cid ? data.data : category
      );
      localStorage.setItem("categories", JSON.stringify(updatedCategories)); // Save to localStorage
      return { categories: updatedCategories };
    });

    return { success: true, message: data.message };
  },
}));
