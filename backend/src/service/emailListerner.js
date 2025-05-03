const {receiveMessage}=require("../utils/consumer");
// const llm_service = require("../service/llm");
const dynamoDao = require("../dao/emailDao");

const startEmailListener = async()=>{
    await receiveMessage((email)=>{
          if (
            !email ||
            !email.id ||
            !email.timestamp ||
            !email.to ||
            !email.from ||
            !email.body
          ) {
            console.log(`email-${email["id"]} parameter missing`);
            return;
          }
        
          try {
            // const result = llm_service.classify(email, user_categories, user_attention);
            // dynamoDao.storeEmail(result);
            console.log(`email-${email["id"]} classify request successful`);
          } catch (error) {
            console.log(`email-${email["id"]} classify request error: ${error}`);
          }
    })
}

module.exports = {
    startEmailListener,
  };
  