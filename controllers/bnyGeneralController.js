const BnyGeneral = require("../models/bnyGeneral");

const path = require("path");
const fs = require("fs");

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
    await newBnyGeneral.save();
    const infoFile = path.join(__dirname, "../info.json");
    const data = JSON.parse(fs.readFileSync(infoFile));
    data[counter] = [fullName, gender];
    fs.writeFileSync(infoFile, JSON.stringify(data, null, 2));
    res.status(201).json(newBnyGeneral);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getId = async (req, res) => {
  try {
    const id = req.params.id;
    const bnyGeneral = await BnyGeneral.findOne({ counter: id });
    res.status(200).json(bnyGeneral);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
