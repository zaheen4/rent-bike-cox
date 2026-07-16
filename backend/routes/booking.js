const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBooking, confirmPayment, getBookingDetails, cancelBooking } = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.post('/confirm', auth, confirmPayment);
router.get('/:id', auth, getBookingDetails);
router.put('/:id/cancel', auth, cancelBooking);

module.exports = router;
