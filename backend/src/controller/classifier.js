const express = require("express");

const app = express();

const llm_service = require("../service/llm");
const dynamoDao = require("../dao/emailDao");

app.post("/classify", async (req, res) => {
  const { email, user_categories = [], user_attention = "" } = req.body;

  // check the email data structure
  if (
    !email ||
    !email.id ||
    !email.timestamp ||
    !email.to ||
    !email.from ||
    !email.body
  ) {
    return res.status(400).json({
      success: false,
      error: "Invalid email structure. Required fields: id, to, from, body",
    });
  }

  try {
    const result = llm_service.classify(email, user_categories, user_attention);
    dynamoDao.storeEmail(result);
    console.log(`email-${email["id"]} classify request successful`);
    res.status(200).json({ success: true, email_id: email["id"] });
  } catch (error) {
    console.log(`email-${email["id"]} classify request error: ${error}`);
    res.status(500).json({
      success: false,
      email_id: email["id"],
      error: error.message || "Internal server error",
    });
  }
});
