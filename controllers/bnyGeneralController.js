const BnyGeneral = require("../models/bnyGeneral");

exports.saveBnyFormData = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, dob, contactNumber } = req.body;

    const emailUsed = await BnyGeneral.findOne({ email });

    if (emailUsed) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newBnyGeneral = new BnyGeneral({
      firstName,
      lastName,
      email,
      gender,
      dob,
      contactNumber,
    });
    await newBnyGeneral.save();
    res.status(201).json(newBnyGeneral);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
