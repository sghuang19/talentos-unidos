import { createBotActor } from "./machine/botMachine.js";

/** @typedef {import("xstate").Actor} Actor */

/**
 * A dictionary that holds all the sessions.
 *
 * @type {Object<string, Actor>}
 */
const sessions = {};

/**
 * Look up a session using phoneNumber
 *
 * @param {string} phoneNumber
 * @returns {Actor | undefined}
 */
export function getSession(phoneNumber) {
  return sessions[phoneNumber];
}

/**
 * Starts a session, note that the botActor returned is started automatically.
 *
 * @param {string} phoneNumber
 * @returns {Actor} A new botActor, or an existing one
 */
export function startSession(phoneNumber) {
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
 *
 * @param {string} phoneNumber
 */
export function stopSession(phoneNumber) {
  const botActor = sessions[phoneNumber];
  botActor?.stop();
  delete sessions[phoneNumber];
}
