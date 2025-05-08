const { receiveMessage } = require("../utils/consumer");
const { SQSClient } = require("@aws-sdk/client-sqs");
const { getSecret } = require("../utils/secretManager.js");
const llm_classifier = require("../service/llm");

const startEmailListener = async () => {
  const llm_service = new llm_classifier();
  await llm_service.init();
  const secret = await getSecret("aws/access");
  const sqs = new SQSClient({
    region: "us-east-2",
    credentials: {
      accessKeyId: secret.AWS_ACCESS_KEY_ID,
      secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
    },
  });
  console.log("Start Email Listener...");
  while (true) {
    await receiveMessage(sqs, (email) => {
      if (
        !email ||
        !email.email_id ||
        !email.timestamp ||
        !email.to_email ||
        !email.from_email ||
        !email.email_body
      ) {
        console.log(`email-${email["id"]} parameter missing`);
        return;
      }

      try {
        llm_service.classify(email);
        console.log(`email-${email["id"]} classify request successful`);
      } catch (error) {
        console.log(`email-${email["id"]} classify request error: ${error}`);
      }
    });
  }
};

module.exports = {
  startEmailListener,
};
