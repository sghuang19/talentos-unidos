import twilio from "twilio";
import "dotenv/config";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

class MessageSender {
  constructor(phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  async sendRegularMessage(messageBody) {
    await client.messages.create({
      messagingServiceSid: serviceSid,
      body: messageBody,
      from: "whatsapp:" + twilioNumber,
      to: "whatsapp:" + this.phoneNumber,
    });
  }

  async sendTemplateMessage(contentSid, contentVariables) {
    try {
      await client.messages.create({
        messagingServiceSid: serviceSid,
        contentSid: contentSid,
        contentVariables: JSON.stringify(contentVariables),
        from: "whatsapp:" + twilioNumber,
        to: "whatsapp:" + this.phoneNumber,
      });
    } catch (e) {
      console.error("Failed to send template msg", e);
    }
  }

  async sendRetryPrompt() {
    await this.sendRegularMessage(
      "Invalid input. Please try again, make sure you're following the instruction. Send exit to stop.",
    );
  }

  /** Sends the command prompt */
  async sendPrompt() {
    const contentSid = "HX36ddf50f01794519de969c163d774038";
    await this.sendTemplateMessage(contentSid);
  }

  /** Sends a greeting message to start info collection */
  async sendGreeting() {
    await this.sendRegularMessage("Let's collect some basic information!");
  }

  async askFirstname() {
    await this.sendRegularMessage("What is your first name?");
  }

  async askLastname() {
    await this.sendRegularMessage("What is your last name?");
  }

  async askBirthdate() {
    await this.sendRegularMessage(
      "What is your birthdate in YYYY-MM-DD format?",
    );
  }

  async askEnglishLevel() {
    const contentSid = "HX4c0a6decc3e9967a30e601837c663f46";
    await this.sendTemplateMessage(contentSid);
  }

  async askPermit() {
    const contentSid = "HX5679e152c1dec3e8c00a6dad4a0055f2";
    await this.sendTemplateMessage(contentSid);
  }

  async askZipcode() {
    await this.sendRegularMessage(
      "What is your zipcode? Only the first 5 digits are needed.",
    );
  }

  async askRelocate() {
    const contentSid = "HX0f900b3845d60dc0c860d77a03173fd9";
    await this.sendTemplateMessage(contentSid);
  }

  async askResume() {
    await this.sendRegularMessage("Please upload your CV.");
  }

  async sendGoodbye() {
    await this.sendRegularMessage("Your info has been recorded, goodbye!");
  }
}

/**
 * Creates a message sender instance that has phoneNumber of recipient specified
 *
 * @param phoneNumber
 * @returns {MessageSender}
 */
export function createMessageSender(phoneNumber) {
  return new MessageSender(phoneNumber);
}
