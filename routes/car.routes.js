const express = require('express');
const {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar
} = require('../controllers/car.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');
const { uploadSingle } = require('../middleware/upload.middleware');

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', protect, isAdmin, uploadSingle, addCar);
router.put('/:id', protect, isAdmin, uploadSingle, updateCar);
router.delete('/:id', protect, isAdmin, deleteCar);

module.exports = router;
