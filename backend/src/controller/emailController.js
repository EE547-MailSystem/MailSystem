const express = require("express");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const data = {
    id: "001",
    timestamp: "YYYY-MM-DD",
    from: "sender",
    subject: "test-subject",
    summary: "preview",
    body: "Here are bodies",
    tags: ["work", "study"],
    urgent_status: true,
  };
  res.status(200).json(data);
});

module.exports = router;
