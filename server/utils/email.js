const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailUtil = async (to, subject, text) => {
  const mailOptions = { from: process.env.EMAIL_USER, to, subject, text };
  await transporter.sendMail(mailOptions);
};

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await sendEmailUtil(to, subject, text);
    res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ msg: "Failed to send email", error: error.message });
  }
};

router.post("/send-email", sendEmail);

module.exports = { sendEmail: sendEmailUtil, router };
