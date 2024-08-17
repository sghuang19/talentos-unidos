import { assign, MachineContext, EventObject, AnyEventObject } from "xstate";
import { uploadUserProfile } from "../services/UserProfileUploader";

/**
 * A factory function that creates an action function for accepting input and
 * updating a certain context. `event.formattedInput` is extracted and put into
 * `context.profile.key`. `formattedInput` is prepped by the `botGuards`
 * functions.
 */
export function acceptInput(key: string) {
  // input is validated and parsed in validate[fieldName]
  return assign({
    profile: ({
      context,
      event,
    }: {
      context: MachineContext;
      event: EventObject;
    }) => ({
      ...context.profile, // takes the original profile and spreads it
      [key]: (event as AnyEventObject).formattedInput, // adds the new key
    }),
  });
  // FIXME: this upcasting should be avoided.
}

/** A factory function that creates an action function for sending a message. */
const createMessageSenderAction =
  (method: string) =>
  async ({ context }: { context: MachineContext }) => {
    await context.messageSender[method]();
  };

/**
 * A list of message methods, must match the functions defined in
 * MessageSender.ts
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

/** The actions in the FSM. Functions coming from MessageSender.ts */
const botActions = messageMethods.reduce(
  (actions, method: string) => {
    actions[method] = createMessageSenderAction(method);
    return actions;
  },
  {} as { [k: string]: CallableFunction },
);

botActions.reviewInfo = ({ context }: { context: MachineContext }) => {
  console.log("Review the info");
  console.log(context);
};

botActions.uploadProfile = ({ context }: { context: MachineContext }) => {
  uploadUserProfile(context.profile).then();
};

export default botActions;
