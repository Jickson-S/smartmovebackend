const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['hatchback', 'sedan', 'suv', 'luxury', 'ev'],
      required: true
    },
    fuel: {
      type: String,
      enum: ['petrol', 'diesel', 'electric'],
      required: true
    },
    seats: {
      type: Number,
      default: 5,
      min: 1
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ''
    },
    imagePublicId: {
      type: String,
      default: ''
    },
    available: {
      type: Boolean,
      default: true
    },
    location: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
