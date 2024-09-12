const path = require("path");
const uploadsFolder = path.join(__dirname, "../uploads/photo-booth-images");
exports.downloadImages = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsFolder, filename);
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Image expired!!");
    }
    res.download(filePath);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
