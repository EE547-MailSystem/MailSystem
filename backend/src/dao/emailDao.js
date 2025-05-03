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

class EmailDao {
  constructor(tableName = "email") {
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

  async storeEmail(emailData) {
    // wrap the command with condition to avoid data duplication
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: this.tableName,
            Item: emailData,
            ConditionExpression: "attribute_not_exists(email_id)", // set condition to avoid data duplication
          },
        },
      ],
    };

    const command = new TransactWriteCommand(params);
    try {
      await this.docClient.send(command);
    } catch (error) {
      console.error("Error storing email:", error);
      throw error;
    }
  }

  // Test Successfully
  async queryByCategory(categoryValue, descending = true) {
    const params = {
      TableName: this.tableName,
      IndexName: "category-timestamp-index",
      KeyConditionExpression: "#cat = :catVal",
      ExpressionAttributeNames: {
        "#cat": "category",
      },
      ExpressionAttributeValues: {
        ":catVal": categoryValue,
      },
      // Sort by timestamp:
      ScanIndexForward: !descending,
    };

    try {
      const { Items } = await this.docClient.send(new QueryCommand(params));
      return Items;
    } catch (err) {
      console.error("Query failed:", err);
      throw err;
    }
  }

  //  for searching usage
  async queryAllCategory(descending = true) {
    const params = {
      TableName: this.tableName,
      IndexName: "global-timestamp-search-index",
      KeyConditionExpression: "#glob = :globVal",
      ExpressionAttributeNames: {
        "#glob": "global",
      },
      ExpressionAttributeValues: {
        ":globVal": "ALL",
      },
      // Sort by timestamp:
      ScanIndexForward: !descending,
    };

    try {
      const { Items } = await this.docClient.send(new QueryCommand(params));
      return Items;
    } catch (err) {
      console.error("Query failed:", err);
      throw err;
    }
  }

  // for update usage
  async queryAllCategoryUpdate(descending = true) {
    const params = {
      TableName: this.tableName,
      IndexName: "global-timestamp-update-index",
      KeyConditionExpression: "#glob = :globVal",
      ExpressionAttributeNames: {
        "#glob": "global",
      },
      ExpressionAttributeValues: {
        ":globVal": "ALL",
      },
      // Sort by timestamp:
      ScanIndexForward: !descending,
    };

    try {
      const { Items } = await this.docClient.send(new QueryCommand(params));
      return Items;
    } catch (err) {
      console.error("Query failed:", err);
      throw err;
    }
  }

  // Test Successfully
  async queryById(id) {
    const params = {
      TableName: this.tableName, // e.g. "EmailsTable"
      Key: {
        email_id: id, // your partition key
      },
    };

    try {
      const { Item } = await this.docClient.send(new GetCommand(params));
      if (!Item) {
        console.log(`No email found with id=${emailId}`);
        return null;
      }
      return Item;
    } catch (err) {
      console.error("Error fetching email:", err);
      throw err;
    }
  }

  // Test Successfully
  async updateUrgentStatus(id, status) {
    const params = {
      TableName: this.tableName,
      Key: {
        email_id: id,
      },
      UpdateExpression: "SET urgent_status = :falseVal",
      ExpressionAttributeValues: {
        ":falseVal": status,
      },
      // optional: make sure the item actually exists
      ConditionExpression: "attribute_exists(email_id)",
      // return only the updated attributes
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const { Attributes } = await this.docClient.send(
        new UpdateCommand(params)
      );
      console.log("Updated attributes:", Attributes);
      return Attributes;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        console.error(`No item found with email_id="${emailId}"`);
        return null;
      }
      console.error("Update failed:", err);
      throw err;
    }
  }

  // Test Successfully
  async updateReadStatus(id, status) {
    const params = {
      TableName: this.tableName,
      Key: {
        email_id: id,
      },
      UpdateExpression: "SET read_status = :falseVal",
      ExpressionAttributeValues: {
        ":falseVal": status,
      },
      // optional: make sure the item actually exists
      ConditionExpression: "attribute_exists(email_id)",
      // return only the updated attributes
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const { Attributes } = await this.docClient.send(
        new UpdateCommand(params)
      );
      console.log("Updated attributes:", Attributes);
      return Attributes;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        console.error(`No item found with email_id="${emailId}"`);
        return null;
      }
      console.error("Update failed:", err);
      throw err;
    }
  }

  async updateCategoty(id, category) {
    const params = {
      TableName: this.tableName,
      Key: {
        email_id: id,
      },
      UpdateExpression: "SET category = :cateVal",
      ExpressionAttributeValues: {
        ":cateVal": category,
      },
      // optional: make sure the item actually exists
      ConditionExpression: "attribute_exists(email_id)",
      // return only the updated attributes
      ReturnValues: "UPDATED_NEW",
    };

    try {
      const { Attributes } = await this.docClient.send(
        new UpdateCommand(params)
      );
      console.log("Updated attributes:", Attributes);
      return Attributes;
    } catch (err) {
      if (err.name === "ConditionalCheckFailedException") {
        console.error(`No item found with email_id="${emailId}"`);
        return null;
      }
      console.error("Update failed:", err);
      throw err;
    }
  }
}

// export this
module.exports = new EmailDao();
