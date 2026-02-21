const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'smartmove/cars'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

module.exports = uploadToCloudinary;
