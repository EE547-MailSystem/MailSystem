const express = require("express");
const router = express.Router();

const llm_classifier = require("../service/llm");
const dao = require("../dao/emailDao");
const authorization = require("../utils/authentication");


let llm_service;
(async () => {
  llm_service = new llm_classifier();
  await llm_service.init();
})();

// All Test Successfully
router.get("/emails/:category/preview", async (req, res) => {
  const { category } = req.params;
  try {
    let items;
    if (category.toLowerCase() === "all") {
      items = await dao.queryAllCategory();
    } else {
      items = await dao.queryByCategory(category);
    }
    if (!items || items.length === 0) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// GET /categories
router.get("/categories", authorization, async (req, res) => {
  try {
    const categories = await llm_service.getCategory();
    if (categories.length === 0) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// GET /emails/:id
router.get("/emails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const email = await dao.queryById(id);
    if (!email) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(email);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// POST /urgentStatus
// 更新 邮件 的 urgent_status
router.post("/urgentStatus", async (req, res) => {
  const { email_id, urgent_status } = req.body;
  if (typeof email_id !== "string" || typeof urgent_status !== "boolean") {
    return res.status(400).send("Wrong Value");
  }
  try {
    const result = await dao.updateUrgentStatus(email_id, urgent_status);
    if (result === null) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// POST /urgentStatus
// 更新 邮件 的 read_status
router.post("/readtStatus", async (req, res) => {
  const { email_id, read_status } = req.body;
  if (typeof email_id !== "string" || typeof read_status !== "boolean") {
    return res.status(400).send("Wrong Value");
  }
  try {
    const result = await dao.updateReadStatus(email_id, read_status);
    if (result === null) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});
///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

// need more validation
// POST /categories
router.post("/categories", async (req, res) => {
  const { newAdd_categories } = req.body;
  if (
    !Array.isArray(newAdd_categories) ||
    newAdd_categories.some((c) => typeof c !== "string")
  ) {
    return res.status(400).send("Wrong Value");
  }
  new_category = await llm_service.updateCategory(newAdd_categories);
  return res.status(200).json(new_category);
});

// // POST /prompt not implemented
// app.post('/prompt', async (req, res) => {
//     const { user_prompt } = req.body;
//     if (typeof user_prompt !== 'string' || !user_prompt.trim()) {
//       return res.status(400).send('Wrong Value');
//     }
//     // TODO: 在这里调用你的业务逻辑来生成真正的 ImportancePrompt
//     const importancePrompt = user_prompt.trim();
//     return res.status(200).json({ importancePrompt });
// });

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
