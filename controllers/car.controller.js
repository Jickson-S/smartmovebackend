const Car = require('../models/Car');
const cloudinary = require('../config/cloudinary');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

const getCars = async (req, res) => {
  try {
    const { type, fuel, minPrice, maxPrice } = req.query;
    const filters = {};

    if (type) {
      filters.type = type;
    }

    if (fuel) {
      filters.fuel = fuel;
    }

    if (minPrice || maxPrice) {
      filters.pricePerDay = {};
      if (minPrice) {
        filters.pricePerDay.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filters.pricePerDay.$lte = Number(maxPrice);
      }
    }

    const cars = await Car.find(filters).sort({ createdAt: -1 });
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch cars' });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    return res.status(200).json(car);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch car' });
  }
};

const addCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      type,
      fuel,
      seats,
      pricePerDay,
      available,
      location,
      description
    } = req.body;

    if (!name || !brand || !type || !fuel || !pricePerDay) {
      return res.status(400).json({
        message: 'name, brand, type, fuel and pricePerDay are required'
      });
    }

    let image = '';
    let imagePublicId = '';

    if (req.file) {
      const upload = await uploadToCloudinary(req.file.buffer);
      image = upload.url;
      imagePublicId = upload.publicId;
    }

    const car = await Car.create({
      name,
      brand,
      type,
      fuel,
      seats: seats ? Number(seats) : 5,
      pricePerDay: Number(pricePerDay),
      available: available === undefined ? true : available === 'true' || available === true,
      location: location || '',
      description: description || '',
      image,
      imagePublicId
    });

    return res.status(201).json({ message: 'Car added successfully', car });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add car' });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (req.file) {
      if (car.imagePublicId) {
        await cloudinary.uploader.destroy(car.imagePublicId);
      }

      const upload = await uploadToCloudinary(req.file.buffer);
      car.image = upload.url;
      car.imagePublicId = upload.publicId;
    }

    const fields = [
      'name',
      'brand',
      'type',
      'fuel',
      'location',
      'description'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        car[field] = req.body[field];
      }
    });

    if (req.body.seats !== undefined) {
      car.seats = Number(req.body.seats);
    }

    if (req.body.pricePerDay !== undefined) {
      car.pricePerDay = Number(req.body.pricePerDay);
    }

    if (req.body.available !== undefined) {
      car.available = req.body.available === 'true' || req.body.available === true;
    }

    await car.save();

    return res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update car' });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.imagePublicId) {
      await cloudinary.uploader.destroy(car.imagePublicId);
    }

    await car.deleteOne();

    return res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete car' });
  }
};

module.exports = {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar
};
