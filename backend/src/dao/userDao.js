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


  class UserDao {
    constructor(tableName = "User") {
      this.tableName = tableName;
      try {
        const client = new DynamoDBClient({
          region: "us-east-2",
        });
        this.docClient = DynamoDBDocumentClient.from(client);
      } catch (error) {
        console.error("connecting error:", error);
      }
    };
    async existsUser(userId) {
        const params = {
            TableName: "User",
            Key: { user_id: userId }
        };
        try{
            const { Item } = await this.docClient.send(new GetCommand(params));
            return Item;  
        }catch(error){
            console.error("connecting error:", error);
        }
        
    }
    async getTokenRecord(userid) {
        const res = await this.docClient.send(new GetCommand({
          TableName: this.tableName,
          Key: { user_id: userid }
        }));
        return res.Item || null;
      }
  }

  module.exports = new UserDao();
