import mongoose, { Schema } from "mongoose";
import "dotenv/config";

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

const userInfoSchema = new mongoose.Schema({
  phoneNumber: String,
  firstname: String,
  lastname: String,
  birthdate: Date,
  english: Number,
  permit: Boolean,
  zipcode: String,
  relocate: Boolean,
  resume: {
    filename: String,
    contentType: String,
    id: Schema.Types.ObjectId,
  },
});

// await mongoose.connect(process.env.MONGODB_URI);

export const UserInfo = mongoose.model("UserInfo", userInfoSchema);
