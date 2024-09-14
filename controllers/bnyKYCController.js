const BnyKYC = require("../models/bnyKYC");

exports.saveBnyKYC = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, dob, contactNumber } = req.body;

    const emailUsed = await BnyKYC.findOne({ email });

    if (emailUsed) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newBnyKYC = new BnyKYC({
      firstName,
      lastName,
      email,
      gender,
      dob,
      contactNumber,
    });
    await newBnyKYC.save();
    res.status(201).json(newBnyKYC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
