require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Car = require('./models/Car');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const randomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildCars = () => [
  {
    name: 'Swift',
    brand: 'Maruti Suzuki',
    type: 'hatchback',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 2200,
    location: 'Bengaluru',
    description: 'Compact hatchback, ideal for city drives.'
  },
  {
    name: 'i10',
    brand: 'Hyundai',
    type: 'hatchback',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 2100,
    location: 'Pune',
    description: 'Easy to park and fuel efficient for daily rides.'
  },
  {
    name: 'Polo',
    brand: 'Volkswagen',
    type: 'hatchback',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 2400,
    location: 'Mumbai',
    description: 'Premium hatchback with stable highway handling.'
  },
  {
    name: 'City',
    brand: 'Honda',
    type: 'sedan',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 3200,
    location: 'Delhi',
    description: 'Comfortable sedan for business and family trips.'
  },
  {
    name: 'Dzire',
    brand: 'Maruti Suzuki',
    type: 'sedan',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 2900,
    location: 'Chennai',
    description: 'Affordable sedan with excellent mileage.'
  },
  {
    name: 'Verna',
    brand: 'Hyundai',
    type: 'sedan',
    fuel: 'diesel',
    seats: 5,
    pricePerDay: 3400,
    location: 'Hyderabad',
    description: 'Stylish sedan with premium interior and torque-rich drive.'
  },
  {
    name: 'Creta',
    brand: 'Hyundai',
    type: 'suv',
    fuel: 'diesel',
    seats: 5,
    pricePerDay: 4200,
    location: 'Bengaluru',
    description: 'Popular mid-size SUV for mixed city and highway use.'
  },
  {
    name: 'Brezza',
    brand: 'Maruti Suzuki',
    type: 'suv',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 3900,
    location: 'Ahmedabad',
    description: 'Reliable SUV with comfortable ride quality.'
  },
  {
    name: 'Nexon',
    brand: 'Tata',
    type: 'suv',
    fuel: 'diesel',
    seats: 5,
    pricePerDay: 4000,
    location: 'Kolkata',
    description: 'Safe and sturdy SUV for urban and weekend drives.'
  },
  {
    name: 'BMW 3 Series',
    brand: 'BMW',
    type: 'luxury',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 10500,
    location: 'Mumbai',
    description: 'Executive luxury sedan with dynamic performance.'
  },
  {
    name: 'Audi A4',
    brand: 'Audi',
    type: 'luxury',
    fuel: 'petrol',
    seats: 5,
    pricePerDay: 9800,
    location: 'Delhi',
    description: 'Refined luxury car with advanced infotainment and comfort.'
  },
  {
    name: 'Nexon EV',
    brand: 'Tata',
    type: 'ev',
    fuel: 'electric',
    seats: 5,
    pricePerDay: 4600,
    location: 'Pune',
    description: 'Electric SUV with practical range for daily routes.'
  },
  {
    name: 'ZS EV',
    brand: 'MG',
    type: 'ev',
    fuel: 'electric',
    seats: 5,
    pricePerDay: 5200,
    location: 'Bengaluru',
    description: 'Feature-rich EV with premium cabin quality.'
  },
  {
    name: 'Innova Crysta',
    brand: 'Toyota',
    type: 'suv',
    fuel: 'diesel',
    seats: 7,
    pricePerDay: 5200,
    location: 'Jaipur',
    description: 'Spacious family mover suitable for long road trips.'
  },
  {
    name: 'Thar',
    brand: 'Mahindra',
    type: 'suv',
    fuel: 'diesel',
    seats: 4,
    pricePerDay: 4800,
    location: 'Goa',
    description: 'Adventure-focused SUV for scenic drives and weekends.'
  }
].map((car) => ({
  ...car,
  image: 'https://via.placeholder.com/400x250',
  imagePublicId: ''
}));

const createBookingDates = (status) => {
  const now = new Date();

  if (status === 'completed' || status === 'cancelled') {
    const daysBack = Math.floor(Math.random() * 60) + 10;
    const duration = Math.floor(Math.random() * 4) + 2;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() - daysBack);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - duration);
    return { startDate, endDate };
  }

  const daysAhead = Math.floor(Math.random() * 30) + 1;
  const duration = Math.floor(Math.random() * 5) + 1;
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() + daysAhead);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);
  return { startDate, endDate };
};

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment');
    }

    await mongoose.connect(process.env.MONGO_URI);

    await Promise.all([
      User.deleteMany({}),
      Car.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({})
    ]);

    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      name: 'Admin User',
      email: 'admin@smartmove.com',
      password: adminPassword,
      role: 'admin',
      isActive: true
    };

    const userNames = [
      { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876500011' },
      { name: 'Ishita Verma', email: 'ishita.verma@example.com', phone: '9876500022' },
      { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', phone: '9876500033' },
      { name: 'Sneha Iyer', email: 'sneha.iyer@example.com', phone: '9876500044' },
      { name: 'Karan Bhatia', email: 'karan.bhatia@example.com', phone: '9876500055' }
    ];

    const regularUsers = await Promise.all(
      userNames.map(async (user) => ({
        ...user,
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        isActive: true
      }))
    );

    const createdUsers = await User.insertMany([adminUser, ...regularUsers]);
    const rentalUsers = createdUsers.filter((user) => user.role === 'user');

    const createdCars = await Car.insertMany(buildCars());

    const bookingStatuses = [
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'completed',
      'pending',
      'pending',
      'pending',
      'pending',
      'confirmed',
      'confirmed',
      'confirmed',
      'cancelled',
      'cancelled',
      'cancelled'
    ];

    const bookingsToCreate = bookingStatuses.map((status) => {
      const user = randomFromArray(rentalUsers);
      const car = randomFromArray(createdCars);
      const { startDate, endDate } = createBookingDates(status);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      return {
        user: user._id,
        car: car._id,
        startDate,
        endDate,
        totalPrice: days * car.pricePerDay,
        status
      };
    });

    const createdBookings = await Booking.insertMany(bookingsToCreate);

    const activeCarIds = new Set(
      createdBookings
        .filter((booking) => booking.status === 'pending' || booking.status === 'confirmed')
        .map((booking) => String(booking.car))
    );

    await Promise.all(
      createdCars.map((car) =>
        Car.findByIdAndUpdate(car._id, {
          available: !activeCarIds.has(String(car._id))
        })
      )
    );

    const completedBookings = createdBookings.filter((booking) => booking.status === 'completed');
    const reviewComments = [
      'Smooth booking experience and clean car.',
      'Very comfortable ride for a weekend trip.',
      'Good condition vehicle and quick pickup.',
      'Pricing was fair and support was responsive.',
      'Fuel efficient and ideal for city travel.',
      'Loved the overall experience with SmartMove.',
      'Car was sanitized and delivered on time.',
      'Great handling and easy drop-off process.',
      'Perfect for family travel and long routes.',
      'Will definitely rent this car again.'
    ];

    const reviews = completedBookings.slice(0, 10).map((booking, index) => ({
      user: booking.user,
      car: booking.car,
      rating: (index % 3) + 3,
      comment: reviewComments[index]
    }));

    const createdReviews = await Review.insertMany(reviews);

    console.log('✅ Database seeded successfully!');
    console.log(`Users created: ${createdUsers.length}`);
    console.log(`Cars created: ${createdCars.length}`);
    console.log(`Bookings created: ${createdBookings.length}`);
    console.log(`Reviews created: ${createdReviews.length}`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
