const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('./cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'csv_uploads',
    resource_type: 'raw', // Important for non-image files like CSV
    format: 'csv',
  },
});

const upload = multer({ storage });

module.exports = upload;
