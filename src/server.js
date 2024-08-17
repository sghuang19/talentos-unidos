import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

import handleMessage from "./middlewares/handleMessage.js";
import prepMessage from "./middlewares/prepMessage.js";
import prepMedia from "./middlewares/prepMedia.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// the sequence of applying middlewares matters
app.post("/twilio", prepMessage, prepMedia, handleMessage);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
