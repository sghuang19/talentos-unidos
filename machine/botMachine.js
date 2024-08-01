import { createActor, setup } from "xstate";

import botStates from "./botStates.js";
import botActions from "./botActions.js";
import botGuards from "./botGuards.js";

import { createUserInfo } from "../UserInfo.js";
import { createMessageSender } from "../MessageSender.js";

const botMachine = setup({
  guards: botGuards,
  actions: botActions,
}).createMachine({
  id: "bot",
  initial: "greeting",
  context: ({ input }) => ({ ...input }),
  states: botStates,
});

export function createBotActor(phoneNumber) {
  const context = createUserInfo(phoneNumber);
  context.messageSender = createMessageSender(phoneNumber);
  return createActor(botMachine, { input: context });
}
