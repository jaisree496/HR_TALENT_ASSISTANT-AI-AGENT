const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, getDB } = require("./db");
const { policyAgent } = require("./agents/policyAgent");

const app = express();

app.use(cors());
app.use(express.json());

/* Connect MongoDB once when the serverless function starts */
let dbConnectionPromise;

function ensureDatabaseConnection() {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  return dbConnectionPromise;
}

/* ================= BASIC ROUTES ================= */

app.get("/", (req, res) => {
  res.send("HR Talent Assistant backend is running");
});

app.get("/api/health", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    res.json({
      message: "Backend is working",
      database: "Connected"
    });
  } catch (error) {
    res.status(500).json({
      message: "Backend is running but MongoDB connection failed",
      error: error.message
    });
  }
});

/* ================= EMPLOYEES ================= */

app.get("/api/employees", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const employees = await getDB()
      .collection("employees")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/employees", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { name, email, role, department, joiningDate } = req.body;

    if (!name || !email || !role || !department || !joiningDate) {
      return res.status(400).json({
        message: "All employee fields are required"
      });
    }

    const newEmployee = {
      name,
      email,
      role,
      department,
      joiningDate,
      onboardingStatus: "Pending",
      createdAt: new Date()
    };

    const result = await getDB()
      .collection("employees")
      .insertOne(newEmployee);

    res.status(201).json({
      message: "Employee added successfully",
      employee: { ...newEmployee, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= LEAVES ================= */

app.get("/api/leaves", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const leaves = await getDB()
      .collection("leaves")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/leaves", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { employeeName, leaveType, startDate, endDate, reason } = req.body;

    if (!employeeName || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        message: "All leave fields are required"
      });
    }

    const newLeave = {
      employeeName,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending",
      createdAt: new Date()
    };

    const result = await getDB().collection("leaves").insertOne(newLeave);

    res.status(201).json({
      message: "Leave request submitted successfully",
      leave: { ...newLeave, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/leaves/:id", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { ObjectId } = require("mongodb");
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected"
      });
    }

    await getDB().collection("leaves").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );

    res.json({ message: `Leave request ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= FEEDBACK ================= */

app.get("/api/feedback", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const feedback = await getDB()
      .collection("feedback")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/feedback", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { employeeName, category, message, anonymous } = req.body;

    if (!category || !message) {
      return res.status(400).json({
        message: "Feedback category and message are required"
      });
    }

    const newFeedback = {
      employeeName: anonymous ? "Anonymous" : employeeName || "Employee",
      category,
      message,
      anonymous: Boolean(anonymous),
      status: "New",
      createdAt: new Date()
    };

    const result = await getDB()
      .collection("feedback")
      .insertOne(newFeedback);

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback: { ...newFeedback, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= PAYROLL ================= */

app.get("/api/payroll", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const payrollIssues = await getDB()
      .collection("payroll")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(payrollIssues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/payroll", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { employeeName, issueType, description } = req.body;

    if (!employeeName || !issueType || !description) {
      return res.status(400).json({
        message: "All payroll fields are required"
      });
    }

    const newIssue = {
      employeeName,
      issueType,
      description,
      status: "Open",
      createdAt: new Date()
    };

    const result = await getDB().collection("payroll").insertOne(newIssue);

    res.status(201).json({
      message: "Payroll issue submitted successfully",
      payrollIssue: { ...newIssue, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/payroll/:id", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { ObjectId } = require("mongodb");
    const { status } = req.body;

    await getDB().collection("payroll").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status } }
    );

    res.json({ message: "Payroll issue updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= AI POLICY CHAT ================= */

app.post("/api/policy-chat", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        answer: null,
        error: "Question is required"
      });
    }

    const answer = await policyAgent(question.trim());

    const chatRecord = {
      question: question.trim(),
      answer,
      createdAt: new Date()
    };

    await getDB().collection("chatHistory").insertOne(chatRecord);

    res.json({
      answer,
      chat: chatRecord
    });
  } catch (error) {
    console.error("Policy chat error:", error.message);

    res.status(500).json({
      answer: null,
      error: error.message
    });
  }
});

/* ================= CHAT HISTORY ================= */

app.get("/api/chat-history", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    const history = await getDB()
      .collection("chatHistory")
      .find({})
      .sort({ createdAt: 1 })
      .toArray();

    res.json(history);
  } catch (error) {
    res.status(500).json({
      error: "Could not load chat history."
    });
  }
});

app.delete("/api/chat-history", async (req, res) => {
  try {
    await ensureDatabaseConnection();

    await getDB().collection("chatHistory").deleteMany({});

    res.json({
      message: "Chat history cleared."
    });
  } catch (error) {
    res.status(500).json({
      error: "Could not clear chat history."
    });
  }
});

module.exports = app;