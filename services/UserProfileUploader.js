import { connect } from "../db/mongo.js";

const collectionName = "profiles";
const db = await connect();
const collection = db.collection(collectionName);

/**
 * @param userProfile Defined in botMachine, botActions
 * @returns {Promise<void>}
 */
export const uploadUserProfile = async (userProfile) => {
  try {
    const result = await collection.insertOne(userProfile);
    console.log(
      `User profile ${userProfile.phoneNumber} saved successfully:`,
      result,
    );
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};
