/**
 * @file Guard functions are used to:
 *
 *   - Validate the input
 *   - Prepare the input
 *   - Invoke `messageSender` methods if the validation fails
 *
 *   `event.messageBody` is accessed, results are put into `event.formattedInput`,
 *   `context` is used to access `messageSender`. When guard returns `false`,
 *   the transition will be prevented.
 *
 *   Note that `event.formattedInput` can be of any type.
 */

const validateName = ({ context, event }) => {
  const name = (event.formattedInput = event.messageBody.trim());
  if (name.length > 50) {
    context.messageSender.sendRegularMessage().then();
    return false;
  }
  return true;
};

const validateDate = ({ context, event }) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (regex.test(event.messageBody.trim())) {
    event.formattedInput = new Date(event.messageBody.trim());
    return true;
  }
  context.messageSender.sendRetryPrompt().then();
  return false;
};

const validateEnglishLevel = ({ context, event }) => {
  switch (event.messageBody) {
    case "No English":
      event.formattedInput = 0;
      break;
    case "Basic English":
      event.formattedInput = 1;
      break;
    case "Fluent English":
      event.formattedInput = 2;
      break;
    default:
      console.log("Invalid input");
      context.messageSender.sendRetryPrompt().then();
      return false;
  }
  return true;
};

const validateBoolean = ({ context, event }) => {
  switch (event.messageBody) {
    case "Yes":
      event.formattedInput = true;
      break;
    case "No":
      event.formattedInput = false;
      break;
    default:
      context.messageSender.sendRetryPrompt().then();
      return false;
  }
  return true;
};

const validateZipcode = ({ context, event }) => {
  // only the first 5 digits are needed
  const regex = /^\d{5}?$/;
  if (regex.test(event.messageBody.trim())) {
    event.formattedInput = event.messageBody.trim();
    return true;
  }
  context.messageSender.sendRetryPrompt().then();
  return false;
};

const validateResume = ({ context, event }) => {
  const { sendRegularMessage } = context.messageSender;
  const file = event.file;
  console.log("File to be validated:", file);
  // file.status defined in prepMedia.js middleware
  switch (file.status) {
    case "ok":
      // a good file, still need to verify its format
      // TODO: skipping format verification for now
      if (true /* file.mimetype */) {
        delete file.status; // status shouldn't be saved to DB
        event.formattedInput = file; // this is dumb, but the file will be later accepted in acceptInput
        return true;
      }
    // explicitly fallthrough, as empty also covers wrong format case
    // eslint-disable-next-line no-fallthrough
    case "empty":
      sendRegularMessage(
        "Please upload a file in supported format: [formats]",
      ).then();
      return false;
    case "error":
      // error occurred while processing the file
      sendRegularMessage(
        "Some error occurred while processing the file, please try again",
      ).then();
      return false;
    case "too-large":
      sendRegularMessage(
        "The file uploaded is too large, please optimize it and submit again.",
      ).then();
      return false;
  }
};

const botGuards = {
  validateName,
  validateDate,
  validateEnglishLevel,
  validateBoolean,
  validateZipcode,
  validateResume,
};

export default botGuards;
