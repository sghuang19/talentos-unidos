import { assign } from "xstate";

export function updateContext(key) {
  // input is validated and parsed in validate[fieldName]
  return assign({
    [key]: ({ event }) => event.messageBody,
  });
}

const createMessageSenderAction =
  (method) =>
  async ({ context }) => {
    await context.messageSender[method]();
  };

const messageMethods = [
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

const botActions = messageMethods.reduce((actions, method) => {
  actions[method] = createMessageSenderAction(method);
  return actions;
}, {});

botActions.reviewInfo = ({ context, _ }) => {
  console.log("Review the info");
  console.log(context);
};

export default botActions;
