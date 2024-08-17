/** @typedef {import("xstate").StateNodeConfig} StateNodeConfig */

/**
 * The behaviors of the root state.
 *
 * @type StateNodeConfig
 */
const rootState = {
  on: {
    start: { target: "collect" }, // start collecting, send to child state
    help: { target: "root", actions: "sendPrompt" }, // repeat the prompt message, use `reenter: true` for reentering
    revise: {}, // FIXME: implement the revision
    // exit is handled at route level
  },
  // entry: "sendPrompt", // NOTE: disabling this effect for now and use action instead
};

export default rootState;
