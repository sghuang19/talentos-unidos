import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

import handleMessage from "./handleMessage.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/twilio", handleMessage);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
