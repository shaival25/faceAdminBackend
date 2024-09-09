const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check if the directory exists, if not create it
const uploadsFolder = path.join(__dirname, "../uploads/photo-booth-images");
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

// Setup storage for images with encrypted filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsFolder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = crypto.randomBytes(16).toString("hex") + ext;
    req.imageName = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage });

exports.uploadImage = upload.single("image"); // Middleware for handling image uploads
