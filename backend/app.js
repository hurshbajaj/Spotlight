const express = require("express");
let cp = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
const api_router = require("./api.js");

const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

let app = express();
const PORT = 8080;

app.use(cp());
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, "../static")));

//protected routes, in ../prot_pub

app.use("/user",is_auth ,express.static(path.join(__dirname, "../prot_pub"), {
  extensions: ['html']
}));

app.use(express.static(path.join(__dirname, '../public'), {
  extensions: ['html']
}));

app.use("/api", api_router);

app.use((req, res) => {
  res.redirect("/");
});


function is_auth(req, res, nxt) {
    if ("is_auth" in req.cookies) {
        nxt()
    }else{
        res.redirect(`/menu`);
    }

}

if(require.main === module){
  app.listen(PORT, ()=>{
      console.log(`Listening at PORT ${PORT}`);
  })
}

module.exports = app;