const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const User = require('../models/User');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');

exports.createBooking = async (req, res) => {
  try {
    const { bikeId, startTime, endTime, couponCode, packageName } = req.body;

    const user = await User.findById(req.user.id);
    if (!user || !user.isVerified) {
      return res.status(403).json({ message: 'Your account must be verified by an admin before booking' });
    }

    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    if (!bike.availability) return res.status(409).json({ message: 'Bike is not available for booking' });

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) return res.status(400).json({ message: 'End time must be after start time' });

    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    if (hours < 1) return res.status(400).json({ message: 'Minimum rental duration is 1 hour' });

    let totalPrice;
    if (packageName) {
      const settings = await Settings.findOne();
      const pkg = settings?.packages?.find(p => p.name === packageName);
      if (!pkg) return res.status(400).json({ message: 'Invalid package' });
      totalPrice = pkg.price;
    } else {
      totalPrice = hours * bike.pricePerHour;
    }

    let discountPercent = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon) {
        discountPercent = coupon.discountPercent;
        totalPrice *= (1 - discountPercent / 100);
      }
    }

    const isShortRental = hours <= 24;
    const minAdvance = isShortRental ? totalPrice * 0.5 : totalPrice * 0.3;

    const booking = new Booking({
      user: req.user.id,
      bike: bikeId,
      startTime,
      endTime,
      totalPrice,
      advancePaid: 0,
      status: 'Pending'
    });

    await booking.save();
    res.status(201).json({ booking, minAdvance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, amountPaid } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.advancePaid = amountPaid;
    booking.paymentStatus = amountPaid >= booking.totalPrice ? 'Paid' : 'Partial';
    booking.status = 'Confirmed';
    
    await booking.save();
    
    // Update bike availability
    await Bike.findByIdAndUpdate(booking.bike, { availability: false });

    res.json({ message: 'Payment confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email nid license phoneNumber address')
            .populate('bike', 'model brand pricePerHour');
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status !== 'Pending' && booking.status !== 'Confirmed') {
            return res.status(400).json({ message: 'Cannot cancel a booking with status: ' + booking.status });
        }

        booking.status = 'Cancelled';
        await booking.save();

        await Bike.findByIdAndUpdate(booking.bike, { availability: true });

        res.json({ message: 'Booking cancelled', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
