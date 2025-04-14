const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, TransactWriteCommand } = require('@aws-sdk/lib-dynamodb');

class Dynamo_Dao{
  constructor(tableName = 'email') {
      this.tableName = tableName;
      try{
          const client = new DynamoDBClient({ 
              region: 'us-east-2',
          });
          this.docClient = DynamoDBDocumentClient.from(client);
      }
      catch(error){
          console.error('connecting error:', error);
      }
  }

  async storeEmail(emailData) {
      // wrap the command with condition to avoid data duplication
      const params = {
        TransactItems: [
          {
            Put: {
              TableName: this.tableName,
              Item: emailData,
              ConditionExpression: 'attribute_not_exists(email_id)' // set condition to avoid data duplication
            }
          }
        ]
      };

      const command = new TransactWriteCommand(params);
      try {
          await this.docClient.send(command);
      } catch (error) {
          console.error('Error storing email:', error);
          throw error;
      }
  }


  

}

// export this
module.exports = new Dynamo_Dao(); 