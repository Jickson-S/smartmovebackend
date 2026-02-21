const mongoose = require('mongoose');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCars,
      totalBookings,
      revenueResult,
      recentBookings,
      monthlyRevenueRaw,
      availableCars,
      bookedCars,
      bookingsByTypeRaw
    ] = await Promise.all([
      User.countDocuments(),
      Car.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Booking.find()
        .populate('user', 'name email')
        .populate('car', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      Booking.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%m',
                date: '$createdAt'
              }
            },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Car.countDocuments({ available: true }),
      Car.countDocuments({ available: false }),
      Booking.aggregate([
        {
          $lookup: {
            from: 'cars',
            localField: 'car',
            foreignField: '_id',
            as: 'carData'
          }
        },
        { $unwind: '$carData' },
        {
          $group: {
            _id: '$carData.type',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const monthlyRevenueMap = new Map(
      monthlyRevenueRaw.map((item) => [Number(item._id) - 1, item.revenue])
    );

    const monthlyRevenue = monthNames.map((month, index) => ({
      month,
      revenue: monthlyRevenueMap.get(index) || 0
    }));

    const bookingsByType = {};
    bookingsByTypeRaw.forEach((item) => {
      bookingsByType[item._id || 'unknown'] = item.count;
    });

    return res.status(200).json({
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue: revenueResult[0]?.total || 0,
      recentBookings,
      monthlyRevenue,
      fleetStats: {
        available: availableCars,
        booked: bookedCars
      },
      bookingsByType
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('car', 'name brand type')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch all bookings' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    if (status === 'completed' || status === 'cancelled') {
      await Car.findByIdAndUpdate(booking.car, { available: true });
    }

    const updated = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('car', 'name brand type');

    return res.status(200).json({
      message: 'Booking status updated successfully',
      booking: updated
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    return res.status(500).json({ message: 'Failed to update booking status' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    const safeUser = await User.findById(user._id).select('-password');

    return res.status(200).json({
      message: `User ${safeUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: safeUser
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    return res.status(500).json({ message: 'Failed to toggle user status' });
  }
};

module.exports = {
  getDashboard,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  toggleUserStatus
};
