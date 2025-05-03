const { receiveMessage } = require("../utils/consumer");
const dynamoDao = require("../dao/emailDao");
const llm_classifier = require("../service/llm");

const startEmailListener = async () => {
  const llm_service = await new llm_classifier().init();
  console.log("Start Email Listener...");
  await receiveMessage(async (email) => {
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
      const result = await llm_service.classify(email, false);
      console.log(result);
      dynamoDao.storeEmail(result);
      console.log(`email-${email["id"]} classify request successful`);
    } catch (error) {
      console.log(`email-${email["id"]} classify request error: ${error}`);
    }
  });
};

module.exports = {
  startEmailListener,
};
