const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const dotenv = require("dotenv");
dotenv.config();

const user_attention = "meeting email";


class llm_classifier{
    constructor(){
        // init the llm client
        this.client = new ChatGroq({
          model: "llama-3.3-70b-versatile",
          temperature: 0
        });

        // init the prompt
        this.rawPrompt = process.env.CLASSILIER_PROMPT;
        this.default_categories = JSON.parse(process.env.DEFAULT_CATEGORIES);
    }

    async classify(email, user_categories=[], user_attention=''){
        try{        
            const {id, timestamp, to, from, subject, body} = email;
            console.log(`Processing email #${id} from ${from} to ${to}`);

            // merge the category
            categories = this.default_categories;
            if(user_categories){
                categories = [...categories, ...user_categories];
            }

            // filled the prompt
            const filledPrompt = this.rawPrompt
                .replace('{CATEGORY_TYPES}', categories.map(t => `"${t}"`).join(', '))
                .replace('{SUBJECT}', subject)
                .replace('{FROM_EMAIL}', from)
                .replace('{TO_EMAIL}', to)
                .replace('{EMAIL_BODY}', body);

            // filled the user_attention part
            if(user_attention){
                filledPrompt.replace('{USER_ATTENTION}', user_attention);
            }
            
            const messages = [
                new SystemMessage("You are an email classifier. Respond with a valid JSON object in the specified format."),
                new HumanMessage(filledPrompt),
            ];

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
                read_status: false
            };
            return dbData;
        }catch(error){
            console.error("Classification process error: ", error);
        }

    }
}

module.exports = new llm_classifier();