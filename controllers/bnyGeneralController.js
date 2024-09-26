const BnyGeneral = require("../models/bnyGeneral");
require("dotenv").config();

const path = require("path");
const fs = require("fs");
const config = require("../config/config");

exports.saveBnyFormData = async (req, res) => {
  try {
    const { fullName, email, gender, dob, contactNumber, city, state } =
      req.body;
    const image = req.imageName;
    const counter = image.split(".")[0];
    const emailUsed = await BnyGeneral.findOne({ email });

    if (emailUsed) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const contactNumberUsed = await BnyGeneral.findOne({ contactNumber });
    if (contactNumberUsed) {
      return res.status(400).json({ message: "Contact Number already exists" });
    }

    const newBnyGeneral = new BnyGeneral({
      fullName,
      city,
      state,
      email,
      image,
      gender,
      counter,
      dob,
      contactNumber,
    });
    let infoFile;
    if (process.env.NODE_ENV === "test") {
      infoFile = path.join(__dirname, "../info.json");
    } else {
      infoFile = path.join(config.faceRecoPath, "info.json"); // <--- 🚨 check the path
    }
    const data = JSON.parse(fs.readFileSync(infoFile));
    data[counter] = [fullName, gender];
    fs.writeFileSync(infoFile, JSON.stringify(data, null, 2));
    await newBnyGeneral.save();
    return res.status(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getId = async (req, res) => {
  try {
    const id = req.params.id;
    const bnyGeneral = await BnyGeneral.findOne(
      { counter: id },
      { _id: 1, fullName: 1 }
    );
    res.status(200).json(bnyGeneral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
