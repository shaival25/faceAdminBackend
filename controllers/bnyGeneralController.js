const BnyGeneral = require("../models/bnyGeneral");

exports.saveBnyFormData = async (req, res) => {
  try {
    const { fullName, email, gender, dob, contactNumber, city, state } =
      req.body;

    const emailUsed = await BnyGeneral.findOne({ email });

    if (emailUsed) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newBnyGeneral = new BnyGeneral({
      fullName,
      city,
      state,
      email,
      gender,
      dob,
      contactNumber,
    });
    await newBnyGeneral.save();
    res.status(201).json(newBnyGeneral._id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
