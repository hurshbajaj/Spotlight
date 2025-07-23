const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cp = require("cookie-parser");
require("dotenv").config();

const psr = new mongoose.Schema({
  gmail: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  code: { type: String }
});
const ps = mongoose.model("User", psr);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post("/sign-up", async (req, res) => {
  console.log("L: " + JSON.stringify(req.body));
  const { gmail } = req.body;

  if (!gmail) {
    return res.status(400).json({ error: "Gmail is required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let user = await ps.findOne({ gmail });

    if (user) {
      if (user.verified) {
        return res.status(400).json({ error: "A user with this Gmail already exists" });
      }
      // User exists but not verified, reset the code
      user.code = code;
    } else {
      // New user
      user = new ps({ gmail, verified: false, code });
    }

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "Spotlight - Verify Yourself",
      text: `Your verification code is: ${code} | Make sure not to lose it!`
    });

    res.status(200).json({ message: "Verification code sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify", async (req, res) => {
  const { gmail, code } = req.body;

  if (!gmail || !code) {
    return res.status(400).json({ error: "Missing gmail or code" });
  }

  try {
    const user = await ps.findOne({ gmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.code !== code) {
      return res.status(401).json({ error: "Invalid code" });
    }

    user.verified = true;
    await user.save();

    res.cookie("is_auth", "true", {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({ message: "Verification successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/check-auth", async (req, res) => {
  if ("is_auth" in req.cookies) {
    res.status(200).json({ is_auth: "I like rust." });
  } else {
    res.status(200).json({ is_auth: false });
  }
});

router.get("/out", async (req, res) => {
  res.clearCookie("is_auth");
  res.redirect("/menu");
});

module.exports = router;
