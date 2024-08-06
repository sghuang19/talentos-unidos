import { assign } from "xstate";

/** @typedef {import("xstate").ActionFunction} ActionFunction */

/**
 * A factory function that creates an action function for accepting input and
 * updating a certain context. `event.formattedInput` is extracted and put into
 * `context.key`. `formattedInput` is prepped by the `botGuards` functions.
 *
 * @param {string} key
 * @returns {ActionFunction}
 */
export function acceptInput(key) {
  // input is validated and parsed in validate[fieldName]
  return assign({
    [key]: ({ event }) => event.formattedInput,
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
  "askResume",
  "sendGoodbye",
];

/**
 * The actions in the FSM. Functions coming from MessageSender.js
 *
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
