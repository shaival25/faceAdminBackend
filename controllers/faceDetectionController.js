const FaceDetection = require("../models/faceDetection");
const path = require("path");
const uploadsFolder = path.join(__dirname, "../uploads");
const fs = require("fs");
const redis = require("../config/redisClient");
const Bus = require("../models/bus");

exports.createFaceDetection = async (req, res) => {
  try {
    const { name, number, email, gender } = req.body;
    const image = req.imageName;
    const counter = image.split(".")[0];

    const newFaceDetection = new FaceDetection({
      name,
      number,
      email,
      image,
      gender,
      counter,
    });

    await newFaceDetection.save();
    const infoFile = path.join(__dirname, "../info.json");
    const data = JSON.parse(fs.readFileSync(infoFile));
    data[counter] = [name, gender];
    fs.writeFileSync(infoFile, JSON.stringify(data, null, 2));
    res.status(201).json(newFaceDetection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFaceDetections = async (req, res) => {
  try {
    const faceDetections = await FaceDetection.find({ deleted_at: null });
    const modifiedFaceDetections = faceDetections.map((fd) => {
      return {
        ...fd._doc,
        image: `/api/face-detection/view/${fd.image}/${fd.macAddress}`,
      };
    });
    res.status(200).json(modifiedFaceDetections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getImages = async (req, res) => {
  const filename = req.params.filename;
  const macAddress = req.params.macAddress;
  const busName = await Bus.getBusName(macAddress);
  const filePath = path.join(
    uploadsFolder + `/${busName}/face-detection-images`,
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

exports.deleteFaceDetection = async (req, res) => {
  try {
    const { selectedRows } = req.body;

    await FaceDetection.updateMany(
      { _id: { $in: selectedRows } },
      { $set: { deleted_at: Date.now() } }
    );
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
