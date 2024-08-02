import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

import { getSession, startSession, stopSession } from "./SessionManager.js";

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/twilio", async (req, res) => {
  const messageBody = req.body.Body;
  const mediaType = req.body.MediaContentType0;
  const mediaUrl = req.body.MediaUrl0;
  const phoneNumber = req.body.From.slice("whatsapp:".length); // remove prefix
  res.status(200).send("");
  console.log(`Received message ${messageBody} from ${phoneNumber}`);

  // look up existing session
  let botActor = getSession(phoneNumber);
  if (botActor) {
    if (messageBody === "exit") {
      stopSession(phoneNumber);
      return;
    }
    botActor.send({ type: "input", messageBody, mediaType, mediaUrl });
    return;
  }

  // no existing session
  botActor = await startSession(phoneNumber);
  const { context } = botActor.getSnapshot();
  switch (messageBody) {
    case "start":
      botActor.start();
      break;
    case "revise":
      console.log("Revising info not supported yet");
      break;
    // otherwise, display the help msg
    default:
      await context.messageSender.sendGreeting();
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
