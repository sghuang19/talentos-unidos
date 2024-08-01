import { updateContext } from "./botActions.js";

const botStates = {
  greeting: {
    entry: "sendGreeting",
    always: "firstname",
  },
  firstname: {
    entry: "askFirstname",
    on: {
      input: {
        guard: "validateName",
        target: "lastname",
        actions: updateContext("firstname"),
      },
    },
  },
  lastname: {
    entry: "askLastname",
    on: {
      input: {
        guard: "validateName",
        target: "birthdate",
        actions: updateContext("lastname"),
      },
    },
  },
  birthdate: {
    entry: "askBirthdate",
    on: {
      input: {
        guard: "validateDate",
        target: "english",
        actions: updateContext("birthdate"),
      },
    },
  },
  english: {
    entry: "askEnglishLevel",
    on: {
      input: {
        guard: "validateEnglishLevel",
        target: "permit",
        actions: updateContext("english"),
      },
    },
  },
  permit: {
    entry: "askPermit",
    on: {
      input: {
        guard: "validateBoolean",
        target: "zipcode",
        actions: updateContext("permit"),
      },
    },
  },
  zipcode: {
    entry: "askZipcode",
    on: {
      input: {
        guard: "validateZipcode",
        target: "relocate",
        actions: updateContext("zipcode"),
      },
    },
  },
  relocate: {
    entry: "askRelocate",
    on: {
      input: {
        guard: "validateBoolean",
        target: "goodbye", // TODO: include resume
        actions: updateContext("relocate"),
      },
    },
  },
  resume: {
    entry: "askResume",
    on: {
      input: {
        guard: "validateResume",
        target: "goodbye",
        actions: updateContext("resume"),
      },
    },
  },
  goodbye: {
    entry: ["reviewInfo", "sendGoodbye"],
    type: "final",
  },
};

export default botStates;
