const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { getSecret } = require("../utils/secretManager");


const { ChatOpenAI } = require("@langchain/openai");


// const user_attention = "";
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
    const secret_api = await getSecret("openai/api");
    const secret_prompt = await getSecret("langchain/api");
    this.client = new ChatOpenAI({
      openAIApiKey: secret_api.OPENAI_API_KEY,
      modelName: "gpt-4o-mini",  // 或者 gpt-4
      temperature: 0,
    });
    this.rawPrompt = secret_prompt.CLASSILIER_PROMPT;
    return this;
  }

  async classify(email, update_flag) {
    try {
      const { email_id, timestamp, from_email, email_subject, email_body } = email;
      console.log(`Processing email #${email_id} from_email ${from_email}`);

      // filled the prompt
      let filledPrompt = this.rawPrompt
        .replace(
          "{CATEGORY_TYPES}",
          this.category.map((t) => `"${t}"`).join(", ")
        )
        .replace("{SUBJECT}", email_subject)
        .replace("{FROM_EMAIL}", from_email)
        .replace("{EMAIL_BODY}", email_body);

      // filled the user_attention part
      if (this.user_attention) {
         filledPrompt = filledPrompt.replace("{USER_ATTENTION}", this.user_attention);
      }

      const messages = [
        new SystemMessage(
          "You are an email classifier. Respond with a valid JSON object in the specified format."
        ),
        new HumanMessage(filledPrompt),
      ];

      const result = await this.client.invoke(messages);

      // Parse the JSON response from LLM
      let llmResponse;
      try {
        result.content = result.content
          .replace(/^```[\s\S]*?\n/, "")
          .replace(/```$/, "")
          .trim();
          // llmResponse = await this.parser.parse(result.content);
        llmResponse = JSON.parse(result.content);
      } catch (e) {
        console.error("Failed to parse LLM response:", result.content);
        throw e;
      }

      // updating category
      if (update_flag == "update_category") {
        const new_category = llmResponse.classification?.category || "Unknown";
        if (new_category != email["category"]) {
          emailDao.updateCategoty(email_id, new_category);
        }
      }
      // updating urgent status
      else if(update_flag == "update_urgent"){
        const urgent_status = llmResponse.is_urgent || false;
        if(urgent_status != email["urgent_status"]){
          emailDao.updateUrgentStatus(email_id, urgent_status);
        }
      }
      // new classify
      else {
        // Prepare data for DynamoDB
        const dbData = {
          email_id: email_id,
          timestamp: timestamp,
          from_email: from_email,
          to_email: to,
          email_subject: email_subject,
          email_body: email_body,
          category: llmResponse.classification?.category || "Unknown",
          summary: llmResponse.summary || "",
          urgent_status: llmResponse.is_urgent || false,
          tags: llmResponse.tags || [],
          read_status: false,
          global: "ALL",
        };
        await emailDao.storeEmail(dbData);
      }

      return { email_id: email_id, llm_response: llmResponse };
    } catch (error) {
      console.error("Classification process error: ", error);
    }
  }

  async validateCategory(userCategories) {
    const filterCategory = [];
    const duplicationCategory = [];
    // 先把默认类别都转成小写，构建一个 Set
    const defaultLowerSet = new Set(this.category.map(c => c.toLowerCase()));
  
    for (const cat of userCategories) {
      const lower = cat.toLowerCase();
      if (defaultLowerSet.has(lower)) {
        // 发现重复，把原始用户输入的 category 保留大小写地加入 duplicationCategory
        duplicationCategory.push(cat);
      } else {
        filterCategory.push(cat);
      }
    }
  
    return {
      filter: filterCategory,
      duplication: duplicationCategory
    };
  }

  async updateCategory(user_category) {
    // check if there is some user category repeated
    const validation = await this.validateCategory(user_category);
    // to tell the user that some categories has been defined repeatly
    if (validation["duplication"].length != 0) {
    }

    // merge the category
    this.category = [...this.category, ...validation["filter"]];

    // get all data
    const allData = await emailDao.queryAllCategoryUpdate();

    for (const data of allData) {
      await this.classify(data, "update_category");
    }
    return this.category;
  }

  async getCategory() {
    return this.category;
  }

  async updateAttention(user_prompt){
    this.user_attention = user_prompt;
    await emailDao.resetAllUrgentStatus();
    // get all data
    const allData = await emailDao.queryAllCategoryUpdate();

    for (const data of allData) {
      await this.classify(data, "update_urgent");
    }
  } 

}

module.exports = llm_classifier;
