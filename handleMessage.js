import { startSession, stopSession } from "./SessionManager.js";

export default async function handleMessage(req, res) {
  const messageBody = req.body.Body;
  const mediaType = req.body.MediaContentType0;
  const mediaUrl = req.body.MediaUrl0;
  const phoneNumber = req.body.From.slice("whatsapp:".length); // remove prefix
  res.status(200).send("");
  console.log(`Received message ${messageBody} from ${phoneNumber}`);

  // just exit
  if (messageBody === "exit") {
    stopSession(phoneNumber);
    return;
  }

  // look up session, if not existing start a new one
  const botActor = await startSession(phoneNumber);

  // if not in root state, treat the message as an input
  if (botActor.getSnapshot().value !== "root") {
    botActor.send({ type: "input", messageBody, mediaType, mediaUrl });
  }

  // otherwise, treat it as a command
  const commands = ["start", "revise", "delete"];
  botActor.send({
    type: commands.includes(messageBody) ? messageBody : "help",
  });
}
