import { startSession, stopSession } from "../SessionManager.js";

const handleMessage = (req, _) => {
  const { messageBody, phoneNumber, file } = req; // prepped by middlewares

  // just exit
  if (messageBody === "exit") {
    stopSession(phoneNumber);
    return;
  }

  // look up session, if not existing start a new one
  const botActor = startSession(phoneNumber);

  // if not in root state, treat the message as an input
  if (botActor.getSnapshot().value !== "root") {
    botActor.send({ type: "input", messageBody, file });
  }

  // otherwise, treat it as a command
  const commands = ["start", "revise", "delete"];
  botActor.send({
    type: commands.includes(messageBody) ? messageBody : "help",
  });
};

export default handleMessage;
