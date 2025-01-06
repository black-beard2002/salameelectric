import mongoose from "mongoose";
import Category from "../models/category.model.js";

export const getCategories = async (req, res) => {
	// " Product.find({name:"keyboard"}) " this will find all products having name=keyboard
	try {
		// retrieve all documents in the desc order of createdAt property
		const categories = await Category.find({}).sort({ createdAt: -1 });
		res.status(200).json({ success: true, data: categories });
	} catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createCategory = async (req, res) => {
	const category = req.body; // user will send this data

	if (!category.name) {
		return res.status(400).json({ success: false, message: "Please provide all fields" });
	}

	const newCategory = await Category.create(category)
	if(newCategory){
		res.status(201).json({ success: true, data: newCategory });
	}
	else{
		res.status(500).json({ success: false, message: "Failed to create product"});
	}

};

export const updateCategory = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Category Id" });
	}

	try {
		const updatedCategory = await Category.findByIdAndUpdate(id, {...req.body}, { new: true });
		if(!updatedCategory){
			res.status(400).json({ success: false, message: "no such category" });
		}
		res.status(200).json({ success: true, data: updatedCategory });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteCategory = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Category Id" });
	}

	try {
		await Category.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Category deleted" });
	} catch (error) {
		console.log("error in deleting category:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};