import express from "express";

import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";
import { getCredentials } from "../controllers/auth.controller.js";
import { getOffers,deleteOffer,createOffer } from "../controllers/offer.controller.js";
const router = express.Router();

router.post("/login",getCredentials);

router.get("/app", getCategories);
router.post("/app/create", createCategory);
router.patch("/app/:id", updateCategory);
router.delete("/app/:id", deleteCategory);

router.get("/app/offers",getOffers);
router.post("/app/offers/create", createOffer);
router.delete("/app/offers/:id",deleteOffer);

export default router;










