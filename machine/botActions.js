import { assign } from "xstate";

/** @typedef {import("xstate").ActionFunction} ActionFunction */

/**
 * A factory function that creates an action function for updating a certain
 * context.
 *
 * @param {string} key
 * @returns {ActionFunction}
 */
export function updateContext(key) {
  // input is validated and parsed in validate[fieldName]
  return assign({
    [key]: ({ event }) => event.messageBody,
  });
}

/**
 * A factory function that creates an action function for sending a message.
 *
 * @param {string} method The name of the method
 * @returns {ActionFunction}
 */
const createMessageSenderAction =
  (method) =>
  async ({ context }) => {
    await context.messageSender[method]();
  };

/**
 * A list of message methods, must match the functions defined in
 * MessageSender.js
 */
const messageMethods = [
  "sendPrompt",
  "sendRetryPrompt",
  "sendGreeting",
  "askFirstname",
  "askLastname",
  "askBirthdate",
  "askEnglishLevel",
  "askPermit",
  "askZipcode",
  "askRelocate",
  "sendGoodbye",
];

/**
 * @constant
 * @type {Object<string, ActionFunction>}
 */
const botActions = messageMethods.reduce((actions, method) => {
  actions[method] = createMessageSenderAction(method);
  return actions;
}, {});

botActions.reviewInfo = ({ context }) => {
  console.log("Review the info");
  console.log(context);
};

export default botActions;
