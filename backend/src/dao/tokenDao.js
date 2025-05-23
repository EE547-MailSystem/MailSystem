const {
    DynamoDBClient,
    ListTablesCommand,
  } = require("@aws-sdk/client-dynamodb");
  const {
    DynamoDBDocumentClient,
    TransactWriteCommand,
    QueryCommand,
    GetCommand,
    UpdateCommand,
  } = require("@aws-sdk/lib-dynamodb");


  class TokenDao {
    constructor(tableName = "JWT_Token") {
      this.tableName = tableName;
      try {
        const client = new DynamoDBClient({
          region: "us-east-2",
        });
        this.docClient = DynamoDBDocumentClient.from(client);
      } catch (error) {
        console.error("connecting error:", error);
      }
    }

    async getTokenRecord(token) {
        const res = await this.docClient.send(new GetCommand({
          TableName: this.tableName,
          Key: { token }
        }));
        return res.Item || null;
      }

  }

// (async () => {
//     const tokenDao = new TokenDao();
//     try {
//       const result = await tokenDao.getTokenRecord("token1");
//       console.log("Token record:", result);
//     } catch (err) {
//       console.error("Error fetching token:", err);
//     }
//   })();


  module.exports = new TokenDao();
