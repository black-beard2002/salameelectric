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
const ITEM_FOLDER = "items";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Multer setup for file handling - modified to handle multiple files
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'itemImage', maxCount: 1 }
]);

// Utility functions
const generateFileName = (id, originalName, type = 'category') => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const cleanFileName = originalName.replace(/\s+/g, "-");
  const folder = type === 'category' ? CATEGORY_FOLDER : ITEM_FOLDER;
  return `${folder}/${id}_${formattedDate}_${cleanFileName}`;
};

const getImagePathFromUrl = (imageUrl) => {
  try {
    if (!imageUrl) return null;
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
      const file = req.files?.image?.[0];

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Category name is required",
        });
      }

      const category = await Category.create({
        name,
        items: [],
        image: "",
      });

      if (file) {
        const fileName = generateFileName(category._id, file.originalname);
        const imageUrl = await uploadToSupabase(file, fileName);
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
      const { name, item, itemId, operation } = req.body;
      const categoryFile = req.files?.image?.[0];
      const itemFile = req.files?.itemImage?.[0];

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

      // Handle item operations
      let currentItems = [...existingCategory.items];
      if (item || operation === 'delete') {
        switch (operation) {
          case "add":
            const newItem = JSON.parse(item);
            newItem.price = parseFloat(newItem.price);
            newItem.offerPrice = parseFloat(newItem.offerPrice);
            // Handle item image upload for new item
            if (itemFile) {
              const fileName = generateFileName(
                `${id}_item_${new mongoose.Types.ObjectId()}`,
                itemFile.originalname,
                'item'
              );
              newItem.image = await uploadToSupabase(itemFile, fileName);
            }
            currentItems.push(newItem);
            break;

            case "update":
              const updatedItem = JSON.parse(item);
              
              updatedItem.price = parseFloat(updatedItem.price);
              updatedItem.offerPrice = parseFloat(updatedItem.offerPrice);
              const itemIndex = currentItems.findIndex(
                (item) => item._id.toString() === itemId
              );
            
              if (itemIndex !== -1) {
                // Handle item image update
                if (itemFile) {
                  // Delete old image if it exists
                  if (currentItems[itemIndex].image) {
                    await deleteSupabaseImage(currentItems[itemIndex].image);
                  }
                  
                  const fileName = generateFileName(
                    `${id}_item_${itemId}`,
                    itemFile.originalname,
                    'item'
                  );
                  updatedItem.image = await uploadToSupabase(itemFile, fileName);
                } else {
                  // Keep existing image if no new image is uploaded
                  updatedItem.image = currentItems[itemIndex].image;
                }
            
                currentItems[itemIndex] = {
                  _id: currentItems[itemIndex]._id,
                  ...updatedItem,
                };
              }
              break;

          case "delete":
            const itemToDelete = currentItems.find(
              (item) => item._id.toString() === itemId
            );
            
            // Delete item image if it exists
            if (itemToDelete?.image) {
              await deleteSupabaseImage(itemToDelete.image);
            }
            
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
      // Handle category updates (name or image)
      const updateFields = {};
      if (name) {
        updateFields.name = name;
      }

      if (categoryFile) {
        try {
          if (existingCategory.image) {
            await deleteSupabaseImage(existingCategory.image);
          }

          const fileName = generateFileName(id, categoryFile.originalname);
          const newImageUrl = await uploadToSupabase(categoryFile, fileName);
          updateFields.image = newImageUrl;
        } catch (error) {
          res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message,
            stack: error.stack // Remove in production
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

    // Delete category image if exists
    if (category.image) {
      await deleteSupabaseImage(category.image);
    }

    // Delete all item images
    for (const item of category.items) {
      if (item.image) {
        await deleteSupabaseImage(item.image);
      }
    }

    // Delete category from MongoDB
    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Category and all associated images deleted successfully",
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
