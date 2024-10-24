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

    // Check if a user with the same email or contactNumber exists
    let existingUser = await BnyGeneral.findOne({
      $or: [{ email: email }, { contactNumber: contactNumber }],
    });

    if (existingUser) {
      // Update existing user
      existingUser.fullName = fullName;
      existingUser.city = city;
      existingUser.state = state;
      existingUser.email = email;
      existingUser.image = image;
      existingUser.gender = gender;
      existingUser.counter = counter;
      existingUser.dob = dob;
      existingUser.contactNumber = contactNumber;

      // Save the updated data
      const updatedData = await existingUser.save();

      // Update info.json file
      let infoFile;
      if (process.env.NODE_ENV === "test") {
        infoFile = path.join(__dirname, "../info.json");
      } else {
        infoFile = path.join(config.faceRecoPath, "info.json");
      }
      const data = JSON.parse(fs.readFileSync(infoFile));
      data[counter] = [fullName, gender];
      fs.writeFileSync(infoFile, JSON.stringify(data, null, 2));

      return res.status(200).send(updatedData);
    } else {
      // Create a new user
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
        infoFile = path.join(config.faceRecoPath, "info.json");
      }
      const data = JSON.parse(fs.readFileSync(infoFile));
      data[counter] = [fullName, gender];
      fs.writeFileSync(infoFile, JSON.stringify(data, null, 2));

      const savedData = await newBnyGeneral.save();

      return res.status(200).send(savedData);
    }
  } catch (error) {
    console.error("Error in saveBnyFormData:", error); // More detailed error logging
    if (!res.headersSent) {
      return res
        .status(500)
        .send("An error occurred while processing your request.");
    }
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
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const contact = req.params.contact;
    const bnyGeneral = await BnyGeneral.findOne({ contactNumber: contact });
    if (!bnyGeneral) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ _id: bnyGeneral._id, fullName: bnyGeneral.fullName });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
