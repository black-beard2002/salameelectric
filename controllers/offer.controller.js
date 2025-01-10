import Offer from "../models/offers.model.js";
import mongoose from "mongoose";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Multer configuration for image uploads
const upload = multer({ storage: multer.memoryStorage() }).single("image");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET_NAME = "uploads";
const CATEGORY_FOLDER = "offers";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const generateFileName = (categoryId, originalName) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0]; // Get YYYY-MM-DD format
  const cleanFileName = originalName.replace(/\s+/g, "-");
  return `${CATEGORY_FOLDER}/${categoryId}_${formattedDate}_${cleanFileName}`;
};

const getImagePathFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  const pathMatch = imageUrl.match(new RegExp(`${BUCKET_NAME}/(.*)`));
  return pathMatch ? pathMatch[1] : null;
};

const uploadToSupabase = async (file, fileName) => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
  
  if (error) throw new Error(`Failed to upload image: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
};

// Retrieve all offers
export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    console.error("Error in fetching offers:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new offer
export const createOffer = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "File upload error", error: err.message });
    }

    const { title, description, price, items, defaultPrice } = req.body;
    const { file } = req;

    if (!title || !description || !price || !items || !file) {
      return res.status(400).json({ success: false, message: "Some fields are null or undefined" });
    }

    try {
      const offerItems = JSON.parse(items);
      offerItems.price = parseFloat(offerItems.price);

      const offer = await Offer.create({
        title,
        description,
        price,
        defaultPrice,
        items: offerItems,
        image: "placeholder",
      });

      const fileName = generateFileName(offer._id, file.originalname);
      const imageUrl = await uploadToSupabase(file, fileName);

      offer.image = imageUrl;
      await offer.save();

      res.status(201).json({ success: true, data: offer });
    } catch (error) {
      console.error("Error in creating offer:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  });
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  const offerId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(offerId)) {
    return res.status(404).json({ success: false, message: "Invalid Offer ID" });
  }

  try {
    const offer = await Offer.findByIdAndDelete(offerId);

    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    const imagePath = getImagePathFromUrl(offer.image);
    if (imagePath) {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([imagePath]);

      if (error) {
        throw new Error(`Failed to delete image: ${error.message}`);
      }
    }

    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    console.error("Error in deleting offer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
