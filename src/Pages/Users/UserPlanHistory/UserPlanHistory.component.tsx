import { UserPlan } from "../../../types/user-plan.interface";
import "../../../commons/history-table.styles.css";

export const UserPlanHistory = ({ plans }: { plans: UserPlan[] }) => {
  if (!plans || plans.length === 0) {
    return <p>No plan history available.</p>;
  }

  return (
    <div className="history">
      <h2>User Plan History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Plan ID</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => (
            <tr key={index}>
              <td>{plan.planId}</td>
              <td>
                <span className={`status ${plan.status}`}>{plan.status}</span>
              </td>
              <td>{new Date(plan.startDate).toLocaleDateString()}</td>
              <td>{new Date(plan.endDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
