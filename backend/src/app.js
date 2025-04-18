const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === "23505") {
    res.status(409).json({ error: "Duplicate entry" });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = app;
