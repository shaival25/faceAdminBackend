const path = require("path");
const uploadsFolder = path.join(__dirname, "../uploads/photo-booth-images");
exports.downloadImages = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsFolder, filename);
  res.download(filePath);
};
