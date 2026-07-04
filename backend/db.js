const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let database;

async function connectDB() {
  await client.connect();
  database = client.db("hr_agent_db");
  console.log("MongoDB connected");
}

function getDB() {
  if (!database) {
    throw new Error("Database is not connected yet");
  }
  return database;
}

module.exports = { connectDB, getDB };