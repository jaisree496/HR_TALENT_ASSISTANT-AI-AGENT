const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI environment variable is missing");
}

let client;
let clientPromise;
let database;

async function connectDB() {
  if (database) {
    return database;
  }

  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  await clientPromise;

  database = client.db("hr_agent_db");

  return database;
}

function getDB() {
  if (!database) {
    throw new Error("Database is not connected yet");
  }

  return database;
}

module.exports = { connectDB, getDB };