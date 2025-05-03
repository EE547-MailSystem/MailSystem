const { ChatGroq } = require("@langchain/groq");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const dotenv = require("dotenv");
dotenv.config();

const user_attention = "";
const emailDao = require('../dao/dynamo'); 

class llm_classifier{
    constructor(user_attention){
        // init the llm client
        this.client = new ChatGroq({
          model: "llama-3.3-70b-versatile",
          temperature: 0
        });
        
        // init the prompt
        this.rawPrompt = process.env.CLASSILIER_PROMPT;
        this.category = JSON.parse(process.env.DEFAULT_CATEGORIES);
        this.user_attention = user_attention
    }

    async classify(email, update_flag = false){
        try{        
            const {id, timestamp, to, from, subject, body} = email;
            console.log(`Processing email #${id} from ${from} to ${to}`);

            // filled the prompt
            const filledPrompt = this.rawPrompt
                .replace('{CATEGORY_TYPES}', this.categories.map(t => `"${t}"`).join(', '))
                .replace('{SUBJECT}', subject)
                .replace('{FROM_EMAIL}', from)
                .replace('{TO_EMAIL}', to)
                .replace('{EMAIL_BODY}', body);

            // filled the user_attention part
            if(this.user_attention){
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
            
            // updating category
            if(update_flag){
                const new_category = llmResponse.classification?.category || "Unknown";
                if(new_category != email["category"]){
                    emailDao.updateCategoty(id, new_category);
                }
            }
            // new classify
            else{
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
                    global: "ALL"
                };

                await emailDao.storeEmail(dbData);
            }
            

            return {"id": id, "llm_response": llmResponse};
        }catch(error){
            console.error("Classification process error: ", error);
        }

    }

    async validateCatrogry(user_category){
        let filter_category = [];
        let duplication_category = [];
        const default_category = new Set(this.category);
        for(const category of user_category){
            const dup = default_category.has(category);
            if(dup){
                duplication_category.push(dup);
            }
            else{
                filter_category.push(category)
            }
        }
        return {"filter": filter_category, "duplication": duplication_category}
    }

    async updateCategory(user_category){
        // check if there is some user category repeated
        const validation = await this.validateCatrogry(user_category);
        // to tell the user that some categories has been defined repeatly
        if(validation["duplication"].length != 0){

        }

        // merge the category
        this.category = [...this.category, ...validation["filter"]];

        // get all data
        const allData = emailDao.queryAllCategoryUpdate()

        for(data in allData){
            await this.classify(data);
        }
        return this.category;
    }

    async getCategory(){
        return this.category;
    }

}


module.exports = new llm_classifier();