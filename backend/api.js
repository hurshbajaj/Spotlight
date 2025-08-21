const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cp = require("cookie-parser");
require("dotenv").config();

const psr = new mongoose.Schema({
  gmail: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
  code: { type: String },
  todos: {
    type: [
      {
        todo: { type: String, required: true },
        dd: { type: String, required: true },
        mark: { type: String, default: "todo" }
      }
    ],
    required: true
  },
  tt: {
    mon: { type: String, default: "" },
    tue: { type: String, default: "" },
    wed: { type: String, default: "" },
    thu: { type: String, default: "" },
    fri: { type: String, default: "" },
    sat: { type: String, default: "" },
    sun: { type: String, default: "" }
  }
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
  const { gmail } = req.body;
  if (!gmail) return res.status(400).json({ error: "Gmail is required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    let user = await ps.findOne({ gmail });

    if (user) {
      if (user.verified) {
        return res.status(400).json({ error: "A user with this Gmail already exists" });
      }
      user.code = code;
    } else {
      user = new ps({ gmail, verified: false, code, todos: [], tt: {} });
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
  if (!gmail || !code) return res.status(400).json({ error: "Missing gmail or code" });

  try {
    const user = await ps.findOne({ gmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.code !== code) return res.status(401).json({ error: "Invalid code" });

    user.verified = true;
    await user.save();

    res.cookie("is_auth", `${gmail}`, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
    res.status(200).json({ is_auth: true });
  } else {
    res.status(200).json({ is_auth: false });
  }
});

router.get("/out", async (req, res) => {
  res.clearCookie("is_auth");
  res.redirect("/menu");
});

router.get("/todos", is_auth, async (req, res) => {
  const gmail = req.cookies.is_auth;
  try {
    const user = await ps.findOne({ gmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ todos: user.todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/todos", is_auth, async (req, res) => {
  const gmail = req.cookies.is_auth;
  const { todo, dd } = req.body;

  if (!todo || !dd) {
    return res.status(400).json({ error: "todo and dd are required" });
  }

  try {
    const user = await ps.findOne({ gmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.todos.push({ todo, dd });
    await user.save();

    res.status(200).json({ message: "Todo added", todos: user.todos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/todos/:index", is_auth, async (req, res) => {
  const gmail = req.cookies.is_auth;
  const index = parseInt(req.params.index);

  try {
    const user = await ps.findOne({ gmail });
    if (!user || index < 0 || index >= user.todos.length) {
      return res.status(404).json({ error: "Invalid index" });
    }

    user.todos.splice(index, 1);
    await user.save();
    res.status(200).json({ message: "Todo deleted", todos: user.todos });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/todos/move", is_auth, async (req, res) => {
  const gmail = req.cookies.is_auth;
  const { from, to } = req.body;

  try {
    const user = await ps.findOne({ gmail });
    if (!user || from < 0 || to < 0 || from >= user.todos.length || to >= user.todos.length) {
      return res.status(400).json({ error: "Invalid indices" });
    }

    const [moved] = user.todos.splice(from, 1);
    user.todos.splice(to, 0, moved);
    await user.save();

    res.status(200).json({ message: "Todo moved", todos: user.todos });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/todos/mark/:index", is_auth, async (req, res) => {
  const gmail = req.cookies.is_auth;
  const index = parseInt(req.params.index);

  const cycle = ["todo", "doing", "done"];

  try {
    const user = await ps.findOne({ gmail });
    if (!user || index < 0 || index >= user.todos.length) {
      return res.status(404).json({ error: "Invalid index" });
    }

    const currentMark = user.todos[index].mark || "todo";
    const nextMark = cycle[(cycle.indexOf(currentMark) + 1) % cycle.length];
    user.todos[index].mark = nextMark;

    await user.save();
    res.status(200).json({ message: "Todo marked", todos: user.todos });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/todos/edit/:index", is_auth, async (req, res) => {
  const gmail = req.cookies.is_auth;
  const index = parseInt(req.params.index);
  const { todo, dd } = req.body;

  if (!todo || !dd) {
    return res.status(400).json({ error: "todo and dd are required" });
  }

  try {
    const user = await ps.findOne({ gmail });
    if (!user || index < 0 || index >= user.todos.length) {
      return res.status(404).json({ error: "Invalid index" });
    }

    user.todos[index].todo = todo;
    user.todos[index].dd = dd;
    await user.save();

    res.status(200).json({ message: "Todo edited", todos: user.todos });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/tt", is_auth, async (req, res) => {
  console.log("patch");
  const gmail = req.cookies.is_auth;

  try {
    const user = await ps.findOne({ gmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.tt = {
      mon: "",
      tue: "",
      wed: "",
      thu: "",
      fri: "",
      sat: "",
      sun: ""
    };

    await user.save();
    res.status(200).json({ message: "tt fields cleared", tt: user.tt });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tt", is_auth, async (req, res) => {
  console.log("post");
  const gmail = req.cookies.is_auth;
  const { day, content } = req.body;

  const validDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  if (!day || !validDays.includes(day)) {
    return res.status(400).json({ error: "Invalid or missing day/content" });
  }

  try {
    const user = await ps.findOne({ gmail });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.tt[day] = content;
    await user.save();

    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tt", is_auth,async (req, res) => {
    try {
        const day = req.query.day;
        const userId = req.cookies?.is_auth;

        if (!day || !userId) return res.status(400).send("Missing day or user ID");

        const user = await ps.findOne({ gmail: userId });

        if (!user || !user.tt) {
            return res.status(404).send("No data found for given day");
        }

        res.json({ content: user.tt[day] });
    } catch (err) {
        console.error("GET /tt error:", err);
        res.status(500).send("Server error");
    }
});


function is_auth(req, res, nxt) {
  if ("is_auth" in req.cookies) {
    nxt();
  } else {
    res.redirect(`/menu`);
  }
}

module.exports = router;