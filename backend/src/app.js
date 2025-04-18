const express = require("express");
const cors = require("cors");
const emailRouter = require("./controller/emailController");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/emails", emailRouter);
module.exports = app;
