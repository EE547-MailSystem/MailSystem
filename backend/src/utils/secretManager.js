const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "us-east-2",
});
const getSecret = async (secretName) => {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    let secret;
    if (response.SecretString) {
      secret = response.SecretString;
    } else {
      secret = Buffer.from(response.SecretBinary, "base64").toString("ascii");
    }

    const parsedSecret = JSON.parse(secret);
    return parsedSecret;
  } catch (err) {
    console.error("Error retrieving secret:", err);
  }
};

module.exports = {
  getSecret,
};
