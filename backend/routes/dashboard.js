const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  addBike, 
  getRenterBikes, 
  toggleBikeAvailability,
  getGlobalSettings, 
  updateGlobalSettings, 
  getAllBikes,
  getAvailableBikes,
  getBikeById,
  toggleBikeVerification,
  getAllUsers,
  toggleUserVerification
} = require('../controllers/dashboardController');

const upload = require('../middleware/uploadMiddleware');

// Shared/Public
router.get('/settings', getGlobalSettings);
router.get('/bikes/available', getAvailableBikes);
router.get('/bikes/:id', getBikeById);

// Renter routes
router.post('/bikes', auth, upload.array('bikeImages', 5), addBike);
router.get('/my-bikes', auth, getRenterBikes);
router.put('/bikes/:id/availability', auth, toggleBikeAvailability);

// Admin routes
router.get('/admin/bikes', auth, getAllBikes);
router.put('/admin/bikes/:id/verify', auth, toggleBikeVerification);
router.get('/admin/users', auth, getAllUsers);
router.put('/admin/users/:id/verify', auth, toggleUserVerification);
router.put('/admin/settings', auth, updateGlobalSettings);

module.exports = router;
