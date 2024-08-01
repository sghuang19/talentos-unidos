function validateName({ _, event }) {
  // nothing to validate
  event.messageBody = event.messageBody.trim();
  return true;
}

async function validateDate({ context, event }) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (regex.test(event.messageBody.trim())) {
    event.messageBody = new Date(event.messageBody.trim());
    return true;
  }
  await context.messageSender.sendRetryPrompt();
  return false;
}

async function validateEnglishLevel({ context, event }) {
  switch (event.messageBody) {
    case "No English":
      event.messageBody = 0;
      break;
    case "Basic English":
      event.messageBody = 1;
      break;
    case "Fluent English":
      event.messageBody = 2;
      break;
    default:
      console.log("Invalid input");
      await context.messageSender.sendRetryPrompt();
      return false;
  }
  return true;
}

async function validateBoolean({ context, event }) {
  switch (event.messageBody) {
    case "Yes":
      event.messageBody = true;
      break;
    case "No":
      event.messageBody = false;
      break;
    default:
      await context.messageSender.sendRetryPrompt();
      return false;
  }
  return true;
}

async function validateZipcode({ context, event }) {
  // only the first 5 digits are needed
  const regex = /^\d{5}?$/;
  if (regex.test(event.messageBody.trim())) {
    event.messageBody = event.messageBody.trim();
    return true;
  }
  await context.messageSender.sendRetryPrompt();
  return false;
}

const botGuards = {
  validateName,
  validateDate,
  validateEnglishLevel,
  validateBoolean,
  validateZipcode,
};

export default botGuards;
