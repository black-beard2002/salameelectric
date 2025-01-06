import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    availability: {
      type: Boolean,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
  }
);
const offerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    defaultPrice:{
      type:Number,
      required:true
    },
    items: { // this will hold the items
      type: [itemSchema],
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Offer = mongoose.model("Offer", offerSchema); //mongoose will pluralize the name Offer as offers in the db.

export default Offer;
