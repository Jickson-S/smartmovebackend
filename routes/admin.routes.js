const express = require('express');
const {
  getDashboard,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  toggleUserStatus
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

router.get('/dashboard', protect, isAdmin, getDashboard);
router.get('/bookings', protect, isAdmin, getAllBookings);
router.put('/bookings/:id/status', protect, isAdmin, updateBookingStatus);
router.get('/users', protect, isAdmin, getAllUsers);
router.patch('/users/:id/toggle', protect, isAdmin, toggleUserStatus);

module.exports = router;
