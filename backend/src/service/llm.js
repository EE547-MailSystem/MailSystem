const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { getSecret } = require("../utils/secretManager");

const user_attention = "";
const emailDao = require("../dao/emailDao");

class llm_classifier {
  constructor(user_attention) {
    this.category = [
      "Work",
      "Personal",
      "Spam",
      "Promotions",
      "Finance",
      "Travel",
      "News",
    ];
    this.user_attention = user_attention;
  }

  async init() {
    const secret = await getSecret("llm/langchain");
    this.client = new ChatGroq({
      apiKey: secret.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0,
    });
    this.rawPrompt = secret.CLASSILIER_PROMPT;
    return this;
  }

  async classify(email, update_flag = false) {
    try {
      const { id, timestamp, to, from, subject, body } = email;
      console.log(`Processing email #${id} from ${from} to ${to}`);

      // filled the prompt
      const filledPrompt = this.rawPrompt
        .replace(
          "{CATEGORY_TYPES}",
          this.category.map((t) => `"${t}"`).join(", ")
        )
        .replace("{SUBJECT}", subject)
        .replace("{FROM_EMAIL}", from)
        .replace("{TO_EMAIL}", to)
        .replace("{EMAIL_BODY}", body);

      // filled the user_attention part
      if (this.user_attention) {
        filledPrompt.replace("{USER_ATTENTION}", user_attention);
      }

      const result = await this.client.invoke(messages);

      // Parse the JSON response from LLM
      let llmResponse;
      try {
        result.content = result.content
          .replace(/^```[\s\S]*?\n/, "")
          .replace(/```$/, "")
          .trim();
        llmResponse = JSON.parse(result.content);
      } catch (e) {
        console.error("Failed to parse LLM response:", result.content);
        throw e;
      }

      // updating category
      if (update_flag) {
        const new_category = llmResponse.classification?.category || "Unknown";
        if (new_category != email["category"]) {
          emailDao.updateCategoty(id, new_category);
        }
      }
      // new classify
      else {
        // Prepare data for DynamoDB
        const dbData = {
          email_id: id,
          timestamp: timestamp,
          from_email: from,
          to_email: to,
          email_subject: subject,
          email_body: body,
          category: llmResponse.classification?.category || "Unknown",
          summary: llmResponse.summary || "",
          urgent_status: llmResponse.is_urgent || false,
          tags: llmResponse.tags || [],
          read_status: false,
          global: "ALL",
        };
        await emailDao.storeEmail(dbData);
      }

      return { id: id, llm_response: llmResponse };
    } catch (error) {
      console.error("Classification process error: ", error);
    }
  }

  async validateCatrogry(user_category) {
    let filter_category = [];
    let duplication_category = [];
    const default_category = new Set(this.category);
    for (const category of user_category) {
      const dup = default_category.has(category);
      if (dup) {
        duplication_category.push(dup);
      } else {
        filter_category.push(category);
      }
    }
    return { filter: filter_category, duplication: duplication_category };
  }

  async updateCategory(user_category) {
    // check if there is some user category repeated
    const validation = await this.validateCatrogry(user_category);
    // to tell the user that some categories has been defined repeatly
    if (validation["duplication"].length != 0) {
    }

    // merge the category
    this.category = [...this.category, ...validation["filter"]];

    // get all data
    const allData = emailDao.queryAllCategoryUpdate();

    for (data in allData) {
      await this.classify(data);
    }
    return this.category;
  }

  async getCategory() {
    return this.category;
  }
}

module.exports = llm_classifier;
