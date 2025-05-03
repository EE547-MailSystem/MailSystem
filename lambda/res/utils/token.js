const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const readline = require("readline");
const fs = require("fs");

const CREDENTIALS_PATH = "credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new OAuth2Client(
  client_id,
  client_secret,
  redirect_uris[0]
);

function getAuthUrl() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  rl.question("Enter the code from that page here: ", async (code) => {
    await getTokens(code);
    rl.close();
  });
}

async function getTokens(code) {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    console.log("Refresh Token:", tokens.refresh_token);
  } catch (error) {
    console.error("Error while retrieving tokens:", error);
  }
}

getAuthUrl();
