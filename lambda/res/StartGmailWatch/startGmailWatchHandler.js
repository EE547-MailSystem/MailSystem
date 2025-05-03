const { google } = require("googleapis");
const { getSecret } = require("./util/secretManager");
const log = require("./util/log");

let oauth2Client = null;

exports.handler = async () => {
  try {
    const secret = await getSecret("google/gmail/api");
    oauth2Client = new google.auth.OAuth2(
      secret.client_id,
      secret.client_secret,
      secret.redirect_uri
    );
    oauth2Client.setCredentials({ refresh_token: secret.refresh_token });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.watch({
      userId: "me",
      requestBody: {
        topicName: "projects/quiet-antler-455515-f0/topics/gmail-notifications",
        labelIds: ["INBOX"],
      },
    });

    log.info("Gmail Watch registered", {
      expiration: response.data.expiration,
      historyId: response.data.historyId,
    });
  } catch (error) {
    log.error("Failed to register Gmail watch", {
      errorMessage: error.message,
      errorStack: error.stack,
    });
  }
};
