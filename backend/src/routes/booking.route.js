import express from 'express';
import { createBooking, getMyBookings, cancelBooking, getOwnerBookingRequests, confirmBooking } from '../controllers/booking.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireOwner } from '../middlewares/role.middleware.js';

const router = express.Router();

// ====== TENANT ROUTES ======
router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

// ====== OWNER ROUTES ======
router.get("/owner-requests", protect, requireOwner, getOwnerBookingRequests);
router.patch("/:id/confirm", protect, requireOwner, confirmBooking);

export default router;
