const PersonCounter = require("../models/personCounter");

const config = require("../config/config");

exports.IncreasePersonCounter = async (req, res) => {
  try {
    const personCounter = await PersonCounter.findOne({});
    if (personCounter) {
      personCounter.counter += 1;
      personCounter.macAddress = config.macAddress;
      await personCounter.save();
    } else {
      await PersonCounter.create({ counter: 1, macAddress: config.macAddress });
    }
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
