import { createActor, setup } from "xstate";

import rootState from "./rootState.js";
import botStates from "./botStates.js";
import botActions from "./botActions.js";
import botGuards from "./botGuards.js";

import { createUserProfile } from "../models/UserProfile.js";
import { createMessageSender } from "../services/MessageSender.js";

/**
 * @typedef {import("xstate").StateMachine} StateMachine
 *
 * @typedef {import("xstate").Actor} Actor
 */

/**
 * Definition of bot machine
 *
 * @constant
 * @type {StateMachine}
 */
const botMachine = setup({
  guards: botGuards,
  actions: botActions,
}).createMachine({
  id: "bot",
  initial: "root",
  context: ({ input }) => ({ ...input }),
  states: {
    root: rootState,
    // collect is a parent state of botStates
    collect: {
      initial: "greeting",
      states: botStates,
    },
  },
});

/**
 * Creates a botActor that has message sender embedded in context
 *
 * @param {string} phoneNumber
 * @returns {Actor} The bot actor, unstarted
 */
export function createBotActor(phoneNumber) {
  const context = {
    profile: createUserProfile(phoneNumber),
    messageSender: createMessageSender(phoneNumber),
  };
  return createActor(botMachine, { input: context });
}
