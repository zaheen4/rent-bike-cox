const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createCoupon, getCoupons, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');

router.get('/validate/:code', validateCoupon);
router.get('/', auth, getCoupons);
router.post('/', auth, createCoupon);
router.put('/:id', auth, updateCoupon);
router.delete('/:id', auth, deleteCoupon);

module.exports = router;
