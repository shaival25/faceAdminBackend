const HeatMap = require("../models/heatMap");
const config = require("../config/config");

exports.saveHeatMap = async (req, res) => {
  try {
    const { heatMap } = req;

    const newHeatMap = new HeatMap({
      heatMap,
      macAddress: config.macAddress,
    });
    await newHeatMap.save();
    res.status(201).json(newHeatMap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
