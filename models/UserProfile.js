/**
 * Creates an empty userProfile to be used in the bot
 *
 * @param phoneNumber
 */
export const createUserProfile = (phoneNumber) => {
  return {
    phoneNumber: phoneNumber,
    firstname: "",
    lastname: "",
    birthdate: null,
    english: 0,
    permit: false,
    zipcode: null,
    relocate: false,
    resume: null,
  };
};
