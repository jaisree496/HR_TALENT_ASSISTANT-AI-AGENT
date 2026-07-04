const { ChatGroq } = require("@langchain/groq");
const { getDB } = require("../db");

async function policyAgent(question) {
  const db = getDB();

  const policies = await db.collection("policies").find({}).toArray();

  const policyText = policies
    .map(
      (policy) =>
        `Policy title: ${policy.title || "HR Policy"}\nPolicy details: ${
          policy.details || policy.description || ""
        }`
    )
    .join("\n\n---\n\n");

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.1-8b-instant",
    temperature: 0.4
  });

  const prompt = `
You are a professional HR Policy Assistant for a company.

Use the HR policies below as your source of information.

Your task:
- Answer naturally, clearly, and professionally.
- Understand spelling mistakes and informal questions.
- If the employee asks a broad question like "What are the rules and regulations?", give a structured summary of all available HR policies.
- Use headings and bullet points when the answer covers multiple policies.
- Do not invent rules that are not in the policies.
- If a specific detail is missing, say only: "The available HR policies do not specify this detail."
- Do not use any fixed fallback reply.
- Do not say "Please contact the HR team because this policy information is not available."

HR POLICIES:
${policyText || "No policy documents were found in the database."}

EMPLOYEE QUESTION:
${question}
`;

  const response = await model.invoke(prompt);

  return response.content;
}

module.exports = { policyAgent };