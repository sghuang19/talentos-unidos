import { Actor, createActor, setup, StateMachine } from "xstate";

import rootState from "./rootState";
import botStates from "./botStates";
import botActions from "./botActions";
import botGuards from "./botGuards";

import { createUserProfile } from "../models/UserProfile";
import { createMessageSender } from "../services/MessageSender";

/** Definition of bot machine */
const botMachine: StateMachine = setup({
  guards: botGuards,
  actions: botActions,
}).createMachine({
  id: "bot",
  initial: "root",
  context: ({ input }: { input: object }) => ({ ...input }),
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
 * @returns The bot actor, unstarted
 */
export function createBotActor(phoneNumber: string): Actor<typeof botMachine> {
  const context = {
    profile: createUserProfile(phoneNumber),
    messageSender: createMessageSender(phoneNumber),
  };
  return createActor(botMachine, { input: context });
}
