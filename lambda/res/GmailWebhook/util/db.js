const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "GmailHistory";

const getLastHistoryId = async () => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: { id: "last" },
  });

  const result = await ddbDocClient.send(command);
  return result.Item?.historyId || null;
};

const saveLastHistoryId = async (historyId) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      id: "last",
      historyId,
      updatedAt: new Date().toISOString(),
    },
  });

  await ddbDocClient.send(command);
};

module.exports = { getLastHistoryId, saveLastHistoryId };
