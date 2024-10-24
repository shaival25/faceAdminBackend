const SipCalc = require("../models/sipCalc");
const postmark = require("postmark");
const BnyGeneral = require("../models/bnyGeneral");
const UserAnalytics = require("../models/userAnalytics");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");

// Load the HTML template
const templatePath = path.join(
  __dirname,
  "..",
  "email-template",
  "emailer.html"
);
const emailTemplate = fs.readFileSync(templatePath, "utf8");

const formatIndianCurrency = (amount) => {
  if (amount === undefined || amount === null) return "N/A";
  const [integerPart, decimalPart] = amount.toString().split(".");
  const formattedIntegerPart = integerPart.replace(
    /(\d)(?=(\d\d)+\d$)/g,
    "$1,"
  );
  return `${formattedIntegerPart}${decimalPart ? "." + decimalPart.slice(0, 2) : ""
    }`;
};

exports.saveSipCalc = async (req, res) => {
  try {
    const {
      investmentDuration,
      expectedROR,
      maturityAmount,
      userId,
      monthlyInvestment,
      totalInvestment,
      goalSelected,
    } = req.body;

    // Create and save the new SipCalc entry
    const newSipCalc = new SipCalc({
      userId,
      investmentDuration,
      expectedROR,
      maturityAmount,
      monthlyInvestment,
      totalInvestment,
      goalSelected,
    });

    const data = await newSipCalc.save();
    const journeyStarted = await UserAnalytics.findOne(
      { userId },
      { journeyStarted: 1 }
    );
    const journeyEnded = new Date();
    const journeyDuration = journeyEnded - journeyStarted.journeyStarted;
    await UserAnalytics.findOneAndUpdate(
      { userId },
      { journeyEnded, journeyDuration }
    );
    res.status(200).json({ message: "SIP calculation saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
