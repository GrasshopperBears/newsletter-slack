// Documentation: https://nodemailer.com/extras/smtp-server/

const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser;
const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
require("dotenv").config();

const subscriptionList = require("./subscription-list");
const subscriptionAddresses = Object.keys(subscriptionList);
const webhookUrls = require("./webhook-url");

const SLACK_CHUNK_SIZE = 3000;

const errorNotification = async (location, message) => {
  await axios.post(webhookUrls.ERROR.webhookUrl, {
    text: `Error in ${location}: ${message}`,
  });
};

const saveMailAsFile = (id, body) => {
  fs.writeFile(`${process.env.SAVE_MAIL_DIR}/${id}.html`, body, (error) => {
    if (error)
      errorNotification("saveMailAsFile", error);
  })
};

const logEmailInbox = (id, { subject, from, date }) => {
  const logText = `[${date}] Mail from (${from.value[0].address}) arrived(id: ${id}/${subject})\n`;
  fs.appendFile(`${process.env.SAVE_MAIL_DIR}/inbox.log`, logText, (error) => {
    if (error)
      errorNotification("logEmailInbox", error);
  })
}

const sendSlackNotification = async (data) => {
  try {
    const mailId = uuidv4();
    const { subject, from, to, text, html, textAsHtml } = data;
    const { address } = from.value[0]
    const allowedTo = `${process.env.MAIL_TO}@${process.env.SERVER_HOST}`

    if (to.value[0].address !== allowedTo)
      return errorNotification("sendSlackNotification", `${allowedTo} cannot get mail`);
    logEmailInbox(mailId, data)
    saveMailAsFile(mailId, html || textAsHtml);

    if (subscriptionAddresses.includes(address)) {
      const { name, category } = subscriptionList[address];
      const { webhookUrl, username, iconEmoji } = webhookUrls[category];
      const body = text?.replaceAll(/[\n\r]{3,}/gi, "\n\n") ?? '';
      const chunks = [];

      // Due to slack text size limitation
      for (let i = 0; i * SLACK_CHUNK_SIZE < body.length; i++)
        chunks.push(body.slice(i * SLACK_CHUNK_SIZE, (i + 1) * SLACK_CHUNK_SIZE));

      await axios.post(webhookUrl, {
        username,
        icon_emoji: iconEmoji,
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `[${name}] ${subject}`,
            },
          },
          ...chunks.map((chunk) => ({
            type: "section",
            text: {
              type: "plain_text",
              text: chunk,
            },
          })),
        ],
      });
    }
  } catch (error) {
    console.log(error);
    await errorNotification("sendSlackNotification", error.message);
  }
};

const onData = (stream, _, callback) => {
  parser(stream, {}, (err, parsed) => {
    if (err) return console.error("Error:", err);
    sendSlackNotification(parsed);
    return callback()
  });
};

const server = new SMTPServer({
  name: `smtp.${process.env.SERVER_HOST}`,
  logger: process.env.NODE_ENV === "development",
  secure: false,
  socketTimeout: 1000 * 60 * 10, // Default 10 mins
  disabledCommands: ["AUTH"],
  onData,
});

server.on("error", (error) => {
  errorNotification("server instance", error.message);
});

server.listen(25);
