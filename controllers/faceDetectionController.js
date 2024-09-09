const FaceDetection = require("../models/faceDetection");
const path = require("path");
const uploadsFolder = path.join(__dirname, "../uploads");
const fs = require("fs");

exports.createFaceDetection = async (req, res) => {
  try {
    const { name, number, email } = req.body;
    const image = req.imageName;

    const newFaceDetection = new FaceDetection({
      name,
      number,
      email,
      image,
    });

    await newFaceDetection.save();
    res.status(201).json(newFaceDetection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFaceDetections = async (req, res) => {
  try {
    const faceDetections = await FaceDetection.find();
    const modifiedFaceDetections = faceDetections.map((fd) => {
      return { ...fd._doc, image: `/api/face-detection/view/${fd.image}` };
    });
    res.status(200).json(modifiedFaceDetections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getImages = async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(
    uploadsFolder + "/face-detection-images",
    filename
  );

  try {
    const image = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(404).json({ message: "Image not found" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};
