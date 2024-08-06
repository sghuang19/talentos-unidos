/** Prepares the Twilio web hook request with messageBody and phoneNumber */
const prepMessage = (req, res, next) => {
  try {
    req.messageBody = req.body.Body;
    req.phoneNumber = req.body.From.slice("whatsapp:".length); // remove prefix
    console.log(
      `Received message "${req.messageBody}" from ${req.phoneNumber}`,
    );
    next();
  } catch (error) {
    // terminate the processing if not a valid Twilio req
    console.error(error);
  }
};

export default prepMessage;
