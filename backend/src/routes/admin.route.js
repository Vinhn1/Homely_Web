import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/role.middleware.js';
import {
    getStats,
    getUsers, approveOwnerRequest, rejectOwnerRequest, banUser,
    getListings, verifyListing, unverifyListing, toggleHideListing, deleteListing,
    getReports, resolveReport, dismissReport
} from '../controllers/admin.controller.js';

const router = express.Router();

// Tất cả routes đều yêu cầu: đăng nhập + là admin
router.use(protect, requireAdmin);

// Stats
router.get('/stats', getStats);

// User Management
router.get('/users', getUsers);
router.patch('/users/:id/approve-owner', approveOwnerRequest);
router.patch('/users/:id/reject-owner', rejectOwnerRequest);
router.patch('/users/:id/ban', banUser);

// Listing Management
router.get('/listings', getListings);
router.patch('/listings/:id/verify', verifyListing);
router.patch('/listings/:id/unverify', unverifyListing);
router.patch('/listings/:id/toggle-hide', toggleHideListing);
router.delete('/listings/:id', deleteListing);

// Reports
router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);
router.patch('/reports/:id/dismiss', dismissReport);

export default router;
