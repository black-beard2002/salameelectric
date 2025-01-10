import mongoose from "mongoose";
import Category from "../models/category.model.js";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
// Constants
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET_NAME = "uploads";
const CATEGORY_FOLDER = "categories";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Multer setup for file handling
const upload = multer({ storage: multer.memoryStorage() }).single("image");

// Utility functions
const generateFileName = (categoryId, originalName) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  const cleanFileName = originalName.replace(/\s+/g, "-");
  return `${CATEGORY_FOLDER}/${categoryId}_${formattedDate}_${cleanFileName}`;
};

const getImagePathFromUrl = (imageUrl) => {
  try {
    if (!imageUrl) return null;

    // Extract the path after the bucket name
    const pathMatch = imageUrl.match(new RegExp(`${BUCKET_NAME}/(.*)`));
    return pathMatch ? pathMatch[1] : null;
  } catch (error) {
    console.error("Error extracting image path:", error);
    return null;
  }
};

const uploadToSupabase = async (file, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

const deleteSupabaseImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const imagePath = getImagePathFromUrl(imageUrl);
    if (!imagePath) return;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath]);

    if (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  } catch (error) {
    console.error("Delete image error:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// Controllers
export const createCategory = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File upload error",
        error: err.message,
      });
    }

    try {
      const { name } = req.body;
      const file = req.file;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      // First create category to get the ID
      const category = await Category.create({
        name,
        items: [],
        image: "",
      });

      // If there's a file, upload it using the category ID
      if (file) {
        const fileName = generateFileName(category._id, file.originalname);
        const imageUrl = await uploadToSupabase(file, fileName);

        // Update category with image URL
        category.image = imageUrl;
        await category.save();
      }

      res.status(201).json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create category",
        error: error.message,
      });
    }
  });
};

export const updateCategory = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "File upload error",
        error: err.message,
      });
    }

    try {
      const { id } = req.params;
      const { name, item, itemId, operation } = req.body; // Get item-related data from request
      const file = req.file;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Update Items
      let currentItems = [...existingCategory.items];
      if (operation === "delete") {
        currentItems = currentItems.filter(
          (item) => item._id.toString() !== itemId
        );

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { items: currentItems },
          { new: true } // Important: return the updated document
        );

        if (!updatedCategory) {
          return res.status(404).json({
            success: false,
            message: "Failed to update category",
          });
        }

        return res.status(200).json({
          success: true,
          data: updatedCategory,
        });
      }
      if (item) {
        switch (operation) {
          case "add":
            const newItem = JSON.parse(item); // Parse incoming item object
            newItem.price = parseFloat(newItem.price);
            currentItems.push(newItem);
            break;
          case "update":
            // Parse and prepare the updated item
            const updatedItem = JSON.parse(item); // Parse updated item
            updatedItem.price = parseFloat(updatedItem.price);

            // Find the index of the item to update
            const index = currentItems.findIndex(
              (item) => item._id.toString() === itemId
            );

            if (index !== -1) {
              // If the item is found, update it
              currentItems[index] = {
                _id: currentItems[index]._id,
                ...updatedItem,
              };
            }

            break;
          case "delete":
            currentItems = currentItems.filter(
              (item) => item._id.toString() !== itemId
            );
            break;
          default:
            return res.status(400).json({
              success: false,
              message: "Invalid item operation",
            });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { items: currentItems },
          { new: true }
        );
        return res.status(200).json({ success: true, data: updatedCategory });
      }

      // Update Name or Image
      const updateFields = {};
      if (name) {
        updateFields.name = name;
      }

      if (file) {
        try {
          if (existingCategory.image) {
            await deleteSupabaseImage(existingCategory.image);
          }

          const fileName = generateFileName(id, file.originalname);
          const newImageUrl = await uploadToSupabase(file, fileName);
          updateFields.image = newImageUrl;
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Failed to process image",
            error: error.message,
          });
        }
      }

      if (Object.keys(updateFields).length > 0) {
        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          updateFields,
          { new: true }
        );

        return res.status(200).json({ success: true, data: updatedCategory });
      }

      return res.status(400).json({
        success: false,
        message: "No valid fields exist in the request to update",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update category",
        error: error.message,
      });
    }
  });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID",
    });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete image from Supabase if exists
    if (category.image) {
      await deleteSupabaseImage(category.image);
    }

    // Delete category from MongoDB
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category and associated image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
