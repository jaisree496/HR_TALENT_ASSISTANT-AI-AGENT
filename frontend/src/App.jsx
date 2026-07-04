import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [payrollIssues, setPayrollIssues] = useState([]);

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    joiningDate: ""
  });

  const [leaveForm, setLeaveForm] = useState({
    employeeName: "",
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const [feedbackForm, setFeedbackForm] = useState({
    employeeName: "",
    category: "Work Culture",
    message: "",
    anonymous: true
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeName: "",
    issueType: "Salary Slip",
    description: ""
  });

  const [policyQuestion, setPolicyQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAllData();
    loadChatHistory();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadAllData = async () => {
    try {
      const [employeesRes, leavesRes, feedbackRes, payrollRes] =
        await Promise.all([
          fetch(`${API_URL}/api/employees`),
          fetch(`${API_URL}/api/leaves`),
          fetch(`${API_URL}/api/feedback`),
          fetch(`${API_URL}/api/payroll`)
        ]);

      if (employeesRes.ok) setEmployees(await employeesRes.json());
      if (leavesRes.ok) setLeaves(await leavesRes.json());
      if (feedbackRes.ok) setFeedbackList(await feedbackRes.json());
      if (payrollRes.ok) setPayrollIssues(await payrollRes.json());
    } catch (error) {
      showMessage("Could not load backend data. Check whether backend is running.");
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat-history`);

      if (!response.ok) {
        return;
      }

      const history = await response.json();

      const messages = [];

      history.forEach((chat) => {
        messages.push({
          sender: "You",
          text: chat.question
        });

        messages.push({
          sender: "HR Assistant",
          text: chat.answer
        });
      });

      setChatMessages(messages);
    } catch (error) {
      console.error("Could not load chat history:", error);
    }
  };

  const clearChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/api/chat-history`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.error || "Could not clear chat history.");
        return;
      }

      setChatMessages([]);
      showMessage("Chat history cleared.");
    } catch (error) {
      showMessage("Could not connect to backend.");
    }
  };

  const addEmployee = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeForm)
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Could not add employee.");
        return;
      }

      setEmployeeForm({
        name: "",
        email: "",
        role: "",
        department: "",
        joiningDate: ""
      });

      showMessage("Employee added successfully.");
      loadAllData();
    } catch (error) {
      showMessage("Backend connection failed.");
    }
  };

  const submitLeave = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leaveForm)
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Could not submit leave request.");
        return;
      }

      setLeaveForm({
        employeeName: "",
        leaveType: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: ""
      });

      showMessage("Leave request submitted successfully.");
      loadAllData();
    } catch (error) {
      showMessage("Backend connection failed.");
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Could not update leave status.");
        return;
      }

      showMessage(`Leave request ${status}.`);
      loadAllData();
    } catch (error) {
      showMessage("Backend connection failed.");
    }
  };

  const submitFeedback = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackForm)
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Could not submit feedback.");
        return;
      }

      setFeedbackForm({
        employeeName: "",
        category: "Work Culture",
        message: "",
        anonymous: true
      });

      showMessage("Feedback submitted successfully.");
      loadAllData();
    } catch (error) {
      showMessage("Backend connection failed.");
    }
  };

  const submitPayrollIssue = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/payroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payrollForm)
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Could not submit payroll issue.");
        return;
      }

      setPayrollForm({
        employeeName: "",
        issueType: "Salary Slip",
        description: ""
      });

      showMessage("Payroll issue submitted successfully.");
      loadAllData();
    } catch (error) {
      showMessage("Backend connection failed.");
    }
  };

  const updatePayrollStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/api/payroll/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Could not update payroll issue.");
        return;
      }

      showMessage("Payroll issue updated.");
      loadAllData();
    } catch (error) {
      showMessage("Backend connection failed.");
    }
  };

  const askPolicyAgent = async () => {
    const question = policyQuestion.trim();

    if (!question || policyLoading) return;

    setChatMessages((oldMessages) => [
      ...oldMessages,
      { sender: "You", text: question }
    ]);

    setPolicyQuestion("");
    setPolicyLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/policy-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Groq request failed.");
      }

      setChatMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: "HR Assistant",
          text: data.answer
        }
      ]);

      // Reloads the saved MongoDB history after Groq reply
      await loadChatHistory();
    } catch (error) {
      setChatMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: "System",
          text: `Chat request failed: ${error.message}`
        }
      ]);
    } finally {
      setPolicyLoading(false);
    }
  };

  const handlePolicyKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askPolicyAgent();
    }
  };

  const pendingLeaves = leaves.filter(
    (leave) => leave.status === "Pending"
  ).length;

  const approvedLeaves = leaves.filter(
    (leave) => leave.status === "Approved"
  ).length;

  const openPayrollIssues = payrollIssues.filter(
    (issue) => issue.status === "Open"
  ).length;

  return (
    <div className="app-container">
      <header className="hero-section">
        <h1>HR Talent Assistant</h1>
        <p>Employee onboarding, HR operations, and AI-powered policy support</p>
      </header>

      {message && <div className="success-message">{message}</div>}

      <section className="dashboard-section">
        <h2>HR Dashboard</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Employees</span>
            <strong>{employees.length}</strong>
          </div>

          <div className="stat-card">
            <span>Pending Leaves</span>
            <strong>{pendingLeaves}</strong>
          </div>

          <div className="stat-card">
            <span>Approved Leaves</span>
            <strong>{approvedLeaves}</strong>
          </div>

          <div className="stat-card">
            <span>Open Payroll Issues</span>
            <strong>{openPayrollIssues}</strong>
          </div>

          <div className="stat-card">
            <span>Employee Feedback</span>
            <strong>{feedbackList.length}</strong>
          </div>
        </div>
      </section>

      <main className="main-grid">
        <section className="card">
          <h2>Employee Onboarding</h2>

          <form onSubmit={addEmployee}>
            <input
              type="text"
              placeholder="Employee name"
              value={employeeForm.name}
              onChange={(event) =>
                setEmployeeForm({ ...employeeForm, name: event.target.value })
              }
            />

            <input
              type="email"
              placeholder="Employee email"
              value={employeeForm.email}
              onChange={(event) =>
                setEmployeeForm({ ...employeeForm, email: event.target.value })
              }
            />

            <input
              type="text"
              placeholder="Job role"
              value={employeeForm.role}
              onChange={(event) =>
                setEmployeeForm({ ...employeeForm, role: event.target.value })
              }
            />

            <input
              type="text"
              placeholder="Department"
              value={employeeForm.department}
              onChange={(event) =>
                setEmployeeForm({
                  ...employeeForm,
                  department: event.target.value
                })
              }
            />

            <input
              type="date"
              value={employeeForm.joiningDate}
              onChange={(event) =>
                setEmployeeForm({
                  ...employeeForm,
                  joiningDate: event.target.value
                })
              }
            />

            <button type="submit">Add Employee</button>
          </form>

          <h3>Employees</h3>

          {employees.length === 0 ? (
            <p className="empty-text">No employees added yet.</p>
          ) : (
            employees.map((employee) => (
              <div className="list-item" key={employee._id}>
                <h4>{employee.name}</h4>
                <p>Email: {employee.email}</p>
                <p>Role: {employee.role}</p>
                <p>Department: {employee.department}</p>
                <p>
                  Joining date:{" "}
                  {employee.joiningDate
                    ? new Date(employee.joiningDate).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  Status:{" "}
                  <span className="status pending">
                    {employee.onboardingStatus}
                  </span>
                </p>
              </div>
            ))
          )}
        </section>

        <section className="card">
          <h2>Leave Management</h2>

          <form onSubmit={submitLeave}>
            <input
              type="text"
              placeholder="Employee name"
              value={leaveForm.employeeName}
              onChange={(event) =>
                setLeaveForm({
                  ...leaveForm,
                  employeeName: event.target.value
                })
              }
            />

            <select
              value={leaveForm.leaveType}
              onChange={(event) =>
                setLeaveForm({ ...leaveForm, leaveType: event.target.value })
              }
            >
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
              <option>Work From Home</option>
            </select>

            <label>Start date</label>
            <input
              type="date"
              value={leaveForm.startDate}
              onChange={(event) =>
                setLeaveForm({ ...leaveForm, startDate: event.target.value })
              }
            />

            <label>End date</label>
            <input
              type="date"
              value={leaveForm.endDate}
              onChange={(event) =>
                setLeaveForm({ ...leaveForm, endDate: event.target.value })
              }
            />

            <textarea
              placeholder="Reason for leave"
              value={leaveForm.reason}
              onChange={(event) =>
                setLeaveForm({ ...leaveForm, reason: event.target.value })
              }
            />

            <button type="submit">Submit Leave Request</button>
          </form>

          <h3>Leave Requests</h3>

          {leaves.length === 0 ? (
            <p className="empty-text">No leave requests yet.</p>
          ) : (
            leaves.map((leave) => (
              <div className="list-item" key={leave._id}>
                <h4>{leave.employeeName}</h4>
                <p>Type: {leave.leaveType}</p>
                <p>
                  Dates: {leave.startDate} to {leave.endDate}
                </p>
                <p>Reason: {leave.reason}</p>
                <p>
                  Status:{" "}
                  <span className={`status ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </p>

                {leave.status === "Pending" && (
                  <div className="button-row">
                    <button
                      type="button"
                      onClick={() =>
                        updateLeaveStatus(leave._id, "Approved")
                      }
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="reject-button"
                      onClick={() =>
                        updateLeaveStatus(leave._id, "Rejected")
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        <section className="card">
          <h2>Employee Feedback</h2>

          <form onSubmit={submitFeedback}>
            {!feedbackForm.anonymous && (
              <input
                type="text"
                placeholder="Employee name"
                value={feedbackForm.employeeName}
                onChange={(event) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    employeeName: event.target.value
                  })
                }
              />
            )}

            <select
              value={feedbackForm.category}
              onChange={(event) =>
                setFeedbackForm({
                  ...feedbackForm,
                  category: event.target.value
                })
              }
            >
              <option>Work Culture</option>
              <option>Manager Feedback</option>
              <option>Facilities</option>
              <option>Workload</option>
              <option>Other</option>
            </select>

            <textarea
              placeholder="Write your feedback"
              value={feedbackForm.message}
              onChange={(event) =>
                setFeedbackForm({
                  ...feedbackForm,
                  message: event.target.value
                })
              }
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={feedbackForm.anonymous}
                onChange={(event) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    anonymous: event.target.checked
                  })
                }
              />
              Submit anonymously
            </label>

            <button type="submit">Submit Feedback</button>
          </form>

          <h3>Feedback Received</h3>

          {feedbackList.length === 0 ? (
            <p className="empty-text">No feedback received yet.</p>
          ) : (
            feedbackList.map((feedback) => (
              <div className="list-item" key={feedback._id}>
                <h4>{feedback.employeeName}</h4>
                <p>Category: {feedback.category}</p>
                <p>{feedback.message}</p>
                <p>
                  Status:{" "}
                  <span className="status pending">{feedback.status}</span>
                </p>
              </div>
            ))
          )}
        </section>

        <section className="card">
          <h2>Payroll Support</h2>

          <form onSubmit={submitPayrollIssue}>
            <input
              type="text"
              placeholder="Employee name"
              value={payrollForm.employeeName}
              onChange={(event) =>
                setPayrollForm({
                  ...payrollForm,
                  employeeName: event.target.value
                })
              }
            />

            <select
              value={payrollForm.issueType}
              onChange={(event) =>
                setPayrollForm({
                  ...payrollForm,
                  issueType: event.target.value
                })
              }
            >
              <option>Salary Slip</option>
              <option>Salary Delay</option>
              <option>Tax Deduction</option>
              <option>PF / ESI</option>
              <option>Bank Account Update</option>
              <option>Other</option>
            </select>

            <textarea
              placeholder="Describe the payroll issue"
              value={payrollForm.description}
              onChange={(event) =>
                setPayrollForm({
                  ...payrollForm,
                  description: event.target.value
                })
              }
            />

            <button type="submit">Raise Payroll Issue</button>
          </form>

          <h3>Payroll Issues</h3>

          {payrollIssues.length === 0 ? (
            <p className="empty-text">No payroll issues yet.</p>
          ) : (
            payrollIssues.map((issue) => (
              <div className="list-item" key={issue._id}>
                <h4>{issue.employeeName}</h4>
                <p>Issue type: {issue.issueType}</p>
                <p>{issue.description}</p>
                <p>
                  Status:{" "}
                  <span className={`status ${issue.status.toLowerCase()}`}>
                    {issue.status}
                  </span>
                </p>

                {issue.status === "Open" && (
                  <div className="button-row">
                    <button
                      type="button"
                      onClick={() =>
                        updatePayrollStatus(issue._id, "Resolved")
                      }
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        <section className="card policy-card">
          <div className="policy-heading">
            <h2>Policy Q&amp;A Agent</h2>

            <button
              type="button"
              className="clear-history-button"
              onClick={clearChatHistory}
            >
              Clear History
            </button>
          </div>

          <p className="helper-text">
            Ask about casual leave, sick leave, work from home, salary slips,
            payroll, feedback, or onboarding.
          </p>

          <div className="chat-box">
            {chatMessages.length === 0 ? (
              <p className="empty-text">
                Start a conversation with the HR Policy Assistant.
              </p>
            ) : (
              chatMessages.map((chat, index) => (
                <div
                  className={`chat-message ${
                    chat.sender === "You"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                  key={index}
                >
                  <strong>{chat.sender}:</strong>
                  <p>{chat.text}</p>
                </div>
              ))
            )}

            {policyLoading && (
              <div className="chat-message assistant-message">
                <strong>HR Assistant:</strong>
                <p>Groq is replying...</p>
              </div>
            )}
          </div>

          <textarea
            placeholder="Ask an HR policy question..."
            value={policyQuestion}
            onChange={(event) => setPolicyQuestion(event.target.value)}
            onKeyDown={handlePolicyKeyDown}
          />

          <button
            type="button"
            onClick={askPolicyAgent}
            disabled={policyLoading}
          >
            {policyLoading ? "Groq is replying..." : "Ask Policy Agent"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;