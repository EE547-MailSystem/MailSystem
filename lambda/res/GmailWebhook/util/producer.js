const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { getSecret } = require("./secretManager.js");

const sendMessage = async (message) => {
  const secret = await getSecret("aws/access");
  const sqs = new SQSClient({
    region: "us-east-2",
    credentials: {
      accessKeyId: secret.AWS_ACCESS_KEY_ID,
      secretAccessKey: secret.AWS_SECRET_ACCESS_KEY,
    },
  });
  const params = {
    QueueUrl:
      "https://sqs.us-east-2.amazonaws.com/381492253717/EE547-MailSystem-Queue.fifo",
    MessageBody: JSON.stringify(message),
    MessageGroupId: "email-group",
    MessageDeduplicationId: message.id,
  };
  try {
    const data = await sqs.send(new SendMessageCommand(params));
    console.log("Message sent successfully:", data.MessageId);
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

module.exports = {
  sendMessage,
};
