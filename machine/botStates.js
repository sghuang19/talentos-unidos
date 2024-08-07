import { acceptInput } from "./botActions.js";

/** @typedef {import("xstate").StateNodeConfig} StateNodeConfig */

// TODO: use templated actions for accepting input to improve performance

/**
 * The definition of substates in collect parent state.
 *
 * @constant
 * @type {Object<string, StateNodeConfig>}
 */
const botStates = {
  greeting: {
    // entry: "sendGreeting", // FIXME: this greeting is displayed after firstname?
    always: "firstname",
    // always: "resume", // jump to resume for debugging
  },
  firstname: {
    entry: "askFirstname",
    on: {
      input: {
        guard: "validateName",
        target: "lastname",
        actions: acceptInput("firstname"),
      },
    },
  },
  lastname: {
    entry: "askLastname",
    on: {
      input: {
        guard: "validateName",
        target: "birthdate",
        actions: acceptInput("lastname"),
      },
    },
  },
  birthdate: {
    entry: "askBirthdate",
    on: {
      input: {
        guard: "validateDate",
        target: "english",
        actions: acceptInput("birthdate"),
      },
    },
  },
  english: {
    entry: "askEnglishLevel",
    on: {
      input: {
        guard: "validateEnglishLevel",
        target: "permit",
        actions: acceptInput("english"),
      },
    },
  },
  permit: {
    entry: "askPermit",
    on: {
      input: {
        guard: "validateBoolean",
        target: "zipcode",
        actions: acceptInput("permit"),
      },
    },
  },
  zipcode: {
    entry: "askZipcode",
    on: {
      input: {
        guard: "validateZipcode",
        target: "relocate",
        actions: acceptInput("zipcode"),
      },
    },
  },
  relocate: {
    entry: "askRelocate",
    on: {
      input: {
        guard: "validateBoolean",
        target: "resume",
        actions: acceptInput("relocate"),
      },
    },
  },
  resume: {
    entry: "askResume",
    on: {
      input: {
        guard: "validateResume",
        target: "goodbye",
        actions: acceptInput("resume"), // still needed
      },
    },
  },
  goodbye: {
    entry: ["reviewInfo", "uploadProfile", "sendGoodbye"],
    type: "final",
  },
};

export default botStates;
