const dotenv = require("dotenv");
dotenv.config();

const rawPrompt = process.env.CLASSILIER_PROMPT;
const defaultCategories = JSON.parse(process.env.DEFAULT_CATEGORIES);
const user_attention = "meeting email";

const emails = [
  {
    email_id: "email_001",
    subject: "Limited Time Offer - 50% Off All Products!",
    body: "Dear valued customer, we're excited to offer you an exclusive 50% discount on all items in our store. This offer is valid only until Friday. Use code SAVE50 at checkout. Don't miss out on these amazing savings!",
    from: "marketing@retailer.com",
    to: ["customer@email.com"],
    timestamp: new Date().toISOString()
  },
  {
    email_id: "email_002",
    subject: "Meeting Request: Project Kickoff",
    body: "Hello team, I'd like to schedule a meeting to discuss the kickoff for our new client project. Please let me know your availability for Thursday afternoon. Best regards, Sarah",
    from: "sarah.manager@company.com",
    to: ["team.member1@company.com", "team.member2@company.com"],
    timestamp: new Date().toISOString()
  },
  {
    email_id: "email_003",
    subject: "Catching up",
    body: "Hi John, It's been a while since we last spoke. How have you been? Would love to catch up over coffee next week if you're available. Let me know what works for you. Cheers, Mike",
    from: "mike.personal@gmail.com",
    to: ["john.friend@gmail.com"],
    timestamp: new Date().toISOString()
  },
  {
    email_id: "email_004",
    subject: "Monthly Tech Digest - June Edition",
    body: "Welcome to our June tech newsletter! This month we cover: 1. Latest AI advancements 2. Upcoming developer conferences 3. New programming tools. Read more on our blog at...",
    from: "newsletter@tech.org",
    to: ["subscriber@email.com"],
    timestamp: new Date().toISOString()
  },
  {
    email_id: "email_005",
    subject: "You've won a million dollars!",
    body: "Congratulations! You've been selected as our grand prize winner. Click here to claim your $1,000,000 prize. Limited time offer!",
    from: "prizes@dubious.com",
    to: ["random.user@email.com"],
    timestamp: new Date().toISOString()
  }
];

const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
class EmailStore {
  constructor(tableName = 'email') {
    this.tableName = tableName;
    const client = new DynamoDBClient({ 
        region: 'us-east-2',
      });
    this.docClient = DynamoDBDocumentClient.from(client);
  }



  async storeEmail(emailData) {
    let params = {
        TableName: this.tableName,
        Item: emailData
    };

    const putCommand = new PutCommand(params);
    try {
        await this.docClient.send(putCommand);
    } catch (error) {
      console.error('Error storing email:', error);
      throw error;
    }
  }
}

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0
});

async function classifyEmail(email) {
  const filledPrompt = rawPrompt
    .replace('{CATEGORY_TYPES}', defaultCategories.map(t => `"${t}"`).join(', '))
    .replace('{SUBJECT}', email.subject)
    .replace('{FROM_EMAIL}', email.from)
    .replace('{TO_EMAIL}', email.to.join(', '))
    .replace('{EMAIL_BODY}', email.body)
    .replace('{USER_ATTENTION}', user_attention);

  const messages = [
    new SystemMessage("You are an email classifier. Respond with a valid JSON object in the specified format."),
    new HumanMessage(filledPrompt),
  ];

  try {
    const result = await model.invoke(messages);
    
    // Parse the JSON response from LLM
    let llmResponse;
    try {
      llmResponse = JSON.parse(result.content);
    } catch (e) {
      console.error("Failed to parse LLM response:", result.content);
      throw new Error("Invalid JSON response from LLM");
    }

    // Prepare data for DynamoDB
    const dbData = {
      email_id: email.email_id,
      timestamp: email.timestamp,
      from_email: email.from,
      to_email: email.to,
      email_subject: email.subject,
      email_body: email.body,
      category: llmResponse.classification?.category || "Unknown",
      subcategory: llmResponse.classification?.subcategory || null,
    //   confidence_score: llmResponse.classification?.confidence || 0,
      summary: llmResponse.summary || "",
      urgent_status: llmResponse.is_urgent || false,
    //   action_required: llmResponse.action_required || false,
      tags: llmResponse.tags || [],
      read_status: false
    };

    return dbData;
  } catch (error) {
    console.error(`Error processing email ${email.email_id}:`, error);
    return null;
  }
}

async function main() {
  const emailStore = new EmailStore();
  
  // Process emails sequentially (better for debugging)
  for (const email of emails) {
    try {
      const classifiedEmail = await classifyEmail(email);
      if (classifiedEmail) {
        await emailStore.storeEmail(classifiedEmail);
      }
    } catch (error) {
      console.error(`Failed to process email ${email.email_id}:`, error);
    }
  }

  console.log("Email processing completed.");
}

main().catch(console.error);