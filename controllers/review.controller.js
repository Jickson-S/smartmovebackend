const Review = require('../models/Review');
const Car = require('../models/Car');

const addReview = async (req, res) => {
  try {
    const { carId, rating, comment } = req.body;

    if (!carId || !rating) {
      return res.status(400).json({ message: 'carId and rating are required' });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const carExists = await Car.exists({ _id: carId });
    if (!carExists) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const existingReview = await Review.findOne({ user: req.user._id, car: carId });

    if (existingReview) {
      existingReview.rating = Number(rating);
      existingReview.comment = comment || '';
      await existingReview.save();

      return res.status(200).json({
        message: 'Review updated successfully',
        review: existingReview
      });
    }

    const review = await Review.create({
      user: req.user._id,
      car: carId,
      rating: Number(rating),
      comment: comment || ''
    });

    return res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add review' });
  }
};

const getReviewsByCar = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

module.exports = {
  addReview,
  getReviewsByCar
};
