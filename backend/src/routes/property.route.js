import express from 'express';
import { getProperties, getPropertyById, addReview, createProperty, updateProperty, deleteProperty, getMyListings, toggleListingStatus } from '../controllers/property.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireOwner } from '../middlewares/role.middleware.js';
import { uploadImages } from '../middlewares/upload.middleware.js';

const router = express.Router();

// ====== PUBLIC ROUTES ======
router.get("/", getProperties);
router.get("/my-listings", protect, requireOwner, getMyListings); // phải trên :id
router.get("/:id", getPropertyById);
router.post("/:id/reviews", protect, addReview);

// ====== OWNER ROUTES ======
router.post("/", protect, requireOwner, uploadImages, createProperty);
router.put("/:id", protect, requireOwner, uploadImages, updateProperty);
router.delete("/:id", protect, requireOwner, deleteProperty);
router.patch("/:id/status", protect, requireOwner, toggleListingStatus);

export default router;