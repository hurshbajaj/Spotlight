const express = require("express");
const cp = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const api_router = require("./api.js");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const app = express();

app.use(cp());
app.use(express.json());

// Serve static folders
app.use("/static", express.static(path.join(__dirname, "../static")));
app.use("/public", express.static(path.join(__dirname, "../public"), {
  extensions: ["html"]
}));
app.use("/user", is_auth, express.static(path.join(__dirname, "../prot_pub"), {
  extensions: ["html"]
}));

// API routes
app.use("/api", api_router);

// Auth middleware
function is_auth(req, res, nxt) {
  if ("is_auth" in req.cookies) {
    nxt();
  } else {
    res.redirect("/menu");
  }
}

// Local dev only
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
  });
}

module.exports = (req, res) => {
  return app(req, res);
};
