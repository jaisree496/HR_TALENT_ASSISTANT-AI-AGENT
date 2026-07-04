const { StateGraph, END, START } = require("@langchain/langgraph");
const { policyAgent } = require("../agents/policyAgent");

const graphState = {
  channels: {
    question: null,
    answer: null
  }
};

async function answerPolicyQuestion(state) {
  const answer = await policyAgent(state.question);

  return {
    answer
  };
}

const workflow = new StateGraph(graphState);

workflow.addNode("policyAgent", answerPolicyQuestion);

workflow.addEdge(START, "policyAgent");
workflow.addEdge("policyAgent", END);

const hrGraph = workflow.compile();

async function runHRGraph(question) {
  const result = await hrGraph.invoke({
    question,
    answer: ""
  });

  return result.answer;
}

module.exports = { runHRGraph };