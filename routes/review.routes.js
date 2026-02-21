const express = require('express');
const { addReview, getReviewsByCar } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, addReview);
router.get('/car/:carId', getReviewsByCar);

module.exports = router;
