import axios from "axios";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import "dotenv/config";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// prepares the tmp dir
const TEMP_DIR = fs.mkdtempSync(tmpdir() + "/");
console.log("TEMP_DIR: ", TEMP_DIR);
// max file size when fetching from Twilio
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB max

/**
 * Prepares the media attached in Twilio web hook request Refer to Twilio docs
 * for more details regarding media message:
 *
 * A `file` property will be added to the req body: `file = { status, path,
 * buffer, mimetype }`. `file.status` is guaranteed to exist.
 *
 * - `status === "ok"`: OK
 * - `status === "too-large"`: the file is too large
 * - `status === "error"`: some error occurred when processing file
 * - `status === "empty"`: no file uploaded, or the file format is not supported
 *   by Twilio
 *
 * @see [Media Resource](https://twilio.com/docs/messaging/api/media-resource)
 * @see [Send and Receive Media Messages with WhatsApp in Node.js](https://twilio.com/docs/whatsapp/tutorial/send-and-receive-media-messages-whatsapp-nodejs)
 */
const prepMedia = async (req, res, next) => {
  const mediaUrl = req.body.MediaUrl0;
  const mediaContentType = req.body.MediaContentType0;
  // if no media, proceed to the next step
  if (!mediaUrl) {
    req.file = { status: "empty" };
    next();
    return;
  }

  try {
    const axioRes = await axios.get(mediaUrl, {
      responseType: "arraybuffer",
      auth: {
        username: accountSid,
        password: authToken,
      },
      maxContentLength: MAX_FILE_SIZE,
    });

    const fileBuffer = axioRes.data;
    // const [_, fileExtension] = mediaContentType.split("/"); // Get the file extension from the content type
    // const fileName = `${req.phoneNumber}.${fileExtension}`;
    // const filePath = path.join(TEMP_DIR, fileName);

    // save the file to disk
    // don't save for now
    // fs.writeFileSync(filePath, fileBuffer);
    // console.log(`File saved to ${filePath}`);
    // TODO: fileBuffer not freed here
    // TODO: delete file from Twilio storage?

    // attach the file info to the request object for further processing
    req.file = {
      status: "ok",
      // path: filePath,
      data: fileBuffer,
      size: fileBuffer.length,
      mimetype: mediaContentType,
    };
  } catch (error) {
    if (error.response && error.response.status === 413) {
      req.file = { status: "too-large" };
      console.warn("Error: File too large");
    } else {
      req.file = { status: "error" };
      console.error("Error processing file:", error);
    }
  }

  // don't forget to proceed to the next middleware/route handler
  next();
};

export default prepMedia;
