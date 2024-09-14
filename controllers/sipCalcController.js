const SipCalc = require("../models/sipCalc");

exports.saveSipCalc = async (req, res) => {
  try {
    const { goalAmount, investmentDuration, expectedROR } = req.body;
    const newSipCalc = new SipCalc({
      goalAmount,
      investmentDuration,
      expectedROR,
    });
    await newSipCalc.save();
    res.status(201).json(newSipCalc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
