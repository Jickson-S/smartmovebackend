const Booking = require('../models/Booking');
const Car = require('../models/Car');

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const calculateDays = (startDate, endDate) => {
  const diff = endDate.getTime() - startDate.getTime();
  return Math.ceil(diff / DAY_IN_MS);
};

const createBooking = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({ message: 'carId, startDate and endDate are required' });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (!car.available) {
      return res.status(400).json({ message: 'Car is currently unavailable' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid start or end date' });
    }

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const totalDays = calculateDays(start, end);
    const totalPrice = totalDays * car.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      car: car._id,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'pending'
    });

    car.available = false;
    await car.save();

    const populatedBooking = await Booking.findById(booking._id).populate('car');

    return res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create booking' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('car');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Completed booking cannot be cancelled' });
    }

    if (booking.status !== 'cancelled') {
      booking.status = 'cancelled';
      await booking.save();

      const car = await Car.findById(booking.car._id);
      if (car) {
        car.available = true;
        await car.save();
      }
    }

    return res.status(200).json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to cancel booking' });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
};
