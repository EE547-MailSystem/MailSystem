const {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require("@aws-sdk/client-sqs");

const receiveMessage = async (sqs, callback) => {
  const params = {
    QueueUrl:
      "https://sqs.us-east-2.amazonaws.com/381492253717/EE547-MailSystem-Queue.fifo",
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 10,
  };

  try {
    const data = await sqs.send(new ReceiveMessageCommand(params));

    if (data.Messages && data.Messages.length > 0) {
      const message = data.Messages[0];
      const info = JSON.parse(message.Body);

      // console.log("Received message:", info);
      await callback(info);
      const deleteParams = {
        QueueUrl: params.QueueUrl,
        ReceiptHandle: message.ReceiptHandle,
      };

      await sqs.send(new DeleteMessageCommand(deleteParams));
      console.log("Message deleted successfully");
    } else {
      console.log("No messages received");
    }
  } catch (err) {
    console.error("Error receiving or processing message:", err);
  }
};

module.exports = {
  receiveMessage,
};
