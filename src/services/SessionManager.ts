import { Actor } from "xstate";
import { createBotActor } from "../machine/botMachine";
import botStates from "../machine/botStates";

/** A dictionary that holds all the sessions. */
const sessions: { [key: string]: Actor<botStates> } = {};

/** Look up a session using phoneNumber */
export function getSession(phoneNumber: string): Actor<botStates> | undefined {
  return sessions[phoneNumber];
}

/**
 * Starts a session, note that the botActor returned is started automatically.
 *
 * @returns A new botActor, or an existing one
 */
export function startSession(phoneNumber: string) {
  let botActor = sessions[phoneNumber];
  if (botActor) {
    return botActor;
  }
  botActor = createBotActor(phoneNumber);
  sessions[phoneNumber] = botActor;
  botActor.start();
  return botActor;
}

/**
 * Stops a session, botActor also stopped. This function is defensive against a
 * session that doesn't exist.
 */
export function stopSession(phoneNumber: string) {
  const botActor = sessions[phoneNumber];
  botActor?.stop();
  delete sessions[phoneNumber];
}
