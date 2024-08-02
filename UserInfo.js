export function createUserInfo(phoneNumber) {
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
}
