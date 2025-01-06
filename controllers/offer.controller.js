
import Offer from "../models/offers.model.js";
import mongoose from "mongoose";
export const getOffers = async (req, res) => {
  try {
    // retrieve all documents in the desc order of createdAt property
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    console.log("error in fetching offers:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createOffer = async (req, res) => {
  try {
    const offer = req.body; // user will send this data
  
    const newOffer = await Offer.create(offer)
    if(newOffer){
      res.status(201).json({ success: true, data: newOffer });
    }
    else{
      res.status(500).json({ success: false, message: "Failed to create offer"});
    }
  
  }
  catch(error){
    console.log("error in creating offer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteOffer = async (req, res) => {
  const offerId = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(404).json({ success: false, message: "Invalid Category Id" });
    }
    const offer = await Offer.findByIdAndDelete(offerId);
    res.status(200).json({ success: true, data: offer });
  } catch (error) {
    console.log("error in deleting offer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
