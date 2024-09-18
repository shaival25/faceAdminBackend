const SipCalc = require("../models/sipCalc");
const postmark = require("postmark");
const BnyGeneral = require("../models/bnyGeneral");
exports.saveSipCalc = async (req, res) => {
  try {
    const {
      goalAmount,
      investmentDuration,
      expectedROR,
      maturityAmount,
      monthlySip,
      userId,
    } = req.body;
    const newSipCalc = new SipCalc({
      goalAmount,
      investmentDuration,
      expectedROR,
      maturityAmount,
      monthlySip,
    });

    await newSipCalc.save();
    const client = new postmark.ServerClient(config.POSTMARK_API_KEY);

    BnyGeneral.findById(userId, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: "User not found" });
      }
      const email = user.email;
      const name = user.fullName;
      await client.sendEmailWithTemplate({
        From: "prince@cactuscreatives.com",
      });
      await client.sendEmail({
        From: "prince@cactuscreatives.com",
        To: email,
        Subject: "Hello from Postmark",
        HtmlBody: "<strong>Hello</strong> dear Postmark user.",
        TextBody: "Hello from Postmark!",
        MessageStream: "outbound",
      });
    });
    res.status(201).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
