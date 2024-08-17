/** @file Provides connection to MongoDB */

import "dotenv/config";
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = "app";

let client: MongoClient;
let db: Db;

export const connect = async () => {
  if (!client || !client.isConnected()) {
    client = new MongoClient(uri ?? "");
    try {
      await client.connect();
      db = client.db(dbName);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
    }
  }
  return db;
};
