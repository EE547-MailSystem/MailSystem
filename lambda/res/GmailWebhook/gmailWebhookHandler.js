const { google } = require("googleapis");
const { getSecret } = require("./util/secretManager");
const { simpleParser } = require("mailparser");
const { Buffer } = require("buffer");
const { sendMessage } = require("./util/producer");
const { getLastHistoryId, saveLastHistoryId } = require("./util/db");
const log = require("./util/log");

let oauth2Client = null;

exports.handler = async (event) => {
  try {
    const secret = await getSecret("google/gmail/api");
    oauth2Client = new google.auth.OAuth2(
      secret.client_id,
      secret.client_secret,
      secret.redirect_uri
    );
    oauth2Client.setCredentials({ refresh_token: secret.refresh_token });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const pubsubMessage = JSON.parse(
      Buffer.from(JSON.parse(event.body).message.data, "base64").toString()
    );

    log.info("Received Gmail Pub/Sub Notification", {
      historyId: pubsubMessage.historyId,
    });

    const prevHistoryId = (await getLastHistoryId()) || pubsubMessage.historyId;
    await saveLastHistoryId(pubsubMessage.historyId);

    log.info("Search Email with previous historyId", {
      prevHistoryId: prevHistoryId,
    });

    const history = await gmail.users.history.list({
      userId: "me",
      startHistoryId: prevHistoryId,
      labelIds: ["INBOX"],
      historyTypes: ["messageAdded"],
    });

    const messages = history.data.history?.flatMap((h) => h.messages) || [];

    log.info("Fetched new emails", { count: messages.length });

    for (const msg of messages) {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "raw",
      });
      const raw = email.data.raw;

      const buffer = Buffer.from(raw, "base64");

      const parsed = await simpleParser(buffer);
      log.info("Fetched new email", {
        emailId: email.data.id,
        from: parsed.from?.text,
        subject: parsed.subject,
      });

      await sendMessage({
        id: email.data.id,
        from: parsed.from?.text,
        to: parsed.to?.text,
        subject: parsed.subject,
        timestamp: parsed.date?.toString(),
        body: parsed.html || parsed.textAsHtml || parsed.text,
      });

      log.info("Pushed email to SQS", {
        emailId: email.data.id,
      });
    }

    return { statusCode: 200, body: "OK" };
  } catch (err) {
    log.error("Error handling Gmail webhook", {
      errorMessage: err.message,
      errorStack: err.stack,
    });
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
