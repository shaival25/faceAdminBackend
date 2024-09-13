const PersonCounter = require("../models/personCounter");

const redis = require("../config/redisClient");
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
    await redis.del("personCounter");
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
