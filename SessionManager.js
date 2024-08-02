import { createBotActor } from "./machine/botMachine.js";

const sessions = {};

export function getSession(phoneNumber) {
  return sessions[phoneNumber];
}

export function startSession(phoneNumber) {
  let botActor = sessions[phoneNumber];
  if (botActor) {
    return botActor;
  }
  botActor = createBotActor(phoneNumber);
  sessions[phoneNumber] = botActor;
  // botActor.start();  // don't start yet
  return botActor;
}

export function stopSession(phoneNumber) {
  const botActor = sessions[phoneNumber];
  botActor?.stop();
  delete sessions[phoneNumber];
}
