const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const { getSecret } = require("../util/secretManager.js");
const { getHeader, getBody } = require("../util/EmailParser.js");
const { sendMessage } = require("./producer.js");

const app = express();
app.use(bodyParser.json());

var oauth2Client;
var historyId;

async function startGmailWatch() {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    const response = await gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName: `projects/quiet-antler-455515-f0/topics/gmail-notifications`,
        labelIds: ["INBOX"],
      },
    });
    historyId = response.data.historyId;
    console.log("🚀 Gmail Watch started:", response.data);
  } catch (error) {
    console.error("❌ Gmail Watch start failed:", error.message);
  }
}

app.post("/gmail-webhook", async (req, res) => {
  try {
    const message = JSON.parse(
      Buffer.from(req.body.message.data, "base64").toString()
    );
    console.log("📩 收到新邮件通知，历史ID:", message.historyId);

    await fetchNewEmails(historyId);
    historyId = message.historyId;
    res.status(200).end();
  } catch (error) {
    console.error("处理推送失败:", error);
    res.status(500).end();
  }
});

async function fetchNewEmails(historyId) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    const history = await gmail.users.history.list({
      userId: "me",
      startHistoryId: historyId,
      labelIds: ["INBOX"],
      historyTypes: ["messageAdded"],
    });

    const messages = history.data.history?.flatMap((h) => h.messages) || [];
    console.log(messages);
    for (const msg of messages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });
      const headers = email.data.payload.headers;
      const parsedEmail = {
        id: msg.id,
        subject: getHeader(headers, "Subject"),
        from: getHeader(headers, "From"),
        to: getHeader(headers, "To"),
        body: getBody(email.data.payload),
      };
      console.log(parsedEmail);
      sendMessage(parsedEmail);
    }
  } catch (error) {
    console.error("拉取邮件失败:", error.message);
  }
}

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`服务运行在 http://localhost:${PORT}`);
  const secret = await getSecret("google/gmail/api");

  oauth2Client = new google.auth.OAuth2(
    secret.client_id,
    secret.client_secret,
    secret.redirect_uri
  );

  oauth2Client.setCredentials({
    refresh_token: secret.refresh_token,
  });

  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      console.log("新的 refresh_token:", tokens.refresh_token);
    }
    oauth2Client.setCredentials(tokens);
  });
  startGmailWatch(oauth2Client);
});
