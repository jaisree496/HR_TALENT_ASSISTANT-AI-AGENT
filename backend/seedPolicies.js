require("dotenv").config();

const { connectDB, getDB } = require("./db");

async function seedPolicies() {
  try {
    await connectDB();

    const db = getDB();

    const policies = [
      {
        title: "Casual Leave Policy",
        details:
          "Employees can take up to 12 Casual Leave days per year. Casual Leave requests must be submitted through the Leave Management section and require manager approval."
      },
      {
        title: "Sick Leave Policy",
        details:
          "Employees can take up to 10 Sick Leave days per year. Employees should submit a leave request with the reason. A medical certificate may be required for more than 2 consecutive days."
      },
      {
        title: "Earned Leave Policy",
        details:
          "Employees can take up to 15 Earned Leave days per year. Earned Leave approval depends on available leave balance and manager approval."
      },
      {
        title: "Work From Home Policy",
        details:
          "Employees can request Work From Home through Leave Management. Work From Home approval depends on project requirements and manager approval."
      },
      {
        title: "Payroll Policy",
        details:
          "Employees can raise payroll issues for salary slips, salary delays, tax deductions, PF, ESI, and bank account updates through Payroll Support."
      },
      {
        title: "Employee Feedback Policy",
        details:
          "Employees can submit feedback about work culture, managers, facilities, and workload. Feedback can be submitted anonymously."
      },
      {
        title: "Employee Onboarding Policy",
        details:
          "New employees are added through Employee Onboarding. Their onboarding status starts as Pending until HR completes the onboarding process."
      }
    ];

    await db.collection("policies").deleteMany({});
    await db.collection("policies").insertMany(policies);

    console.log("HR policies added successfully");
    process.exit(0);
  } catch (error) {
    console.error("Could not add HR policies:", error.message);
    process.exit(1);
  }
}

seedPolicies();