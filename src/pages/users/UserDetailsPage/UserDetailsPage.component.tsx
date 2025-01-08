import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserDetailsPage.styles.css";
import { UserInterface } from "../../../types/user.interface";
import { PaymentInterface } from "../../../types/payment.interface";
import { UserPlan } from "../../../types/user-plan.interface";
import { PaymentHistory } from "../PaymentHistory/PaymentHistory.component";
import { UserPlanHistory } from "../UserPlanHistory/UserPlanHistory.component";
import { Axios } from "../../../api";
import { MessageCircle, User, RotateCcw, FileText } from "lucide-react";

export const UserDetailsPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserInterface>();
  const [payments, setPayments] = useState<PaymentInterface[]>();
  const [userPlans, setUserPlans] = useState<UserPlan[]>();
  const [activeTab, setActiveTab] = useState("payments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await Axios.get(`/users/${id}`);
        setUser(response.data?.data?.user);
        setPayments(response.data?.data?.payments);
        setUserPlans(response.data?.data?.plans);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch user details`);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleMessage = () => {
    // Implement message functionality
    console.log("Message button clicked");
  };

  if (loading) {
    return <div className="loading-state">Loading user details...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!user) {
    return <div className="not-found-state">User not found</div>;
  }

  return (
    <div className="user-details-container">
      <div className="user-details-header">
        <div className="user-details-info">
          <h1>{user.name}</h1>
          <div className="username">@{user.username}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <User size={20} />
          <div className="stat-content">
            <div className="stat-label">Free Trial</div>
            <div className="stat-value">
              {user.freeTrialUsed ? "Used" : "Available"}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <FileText size={20} />
          <div className="stat-content">
            <div className="stat-label">Daily Requests</div>
            <div className="stat-value">{user.dailyRequestsCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <RotateCcw size={20} />
          <div className="stat-content">
            <div className="stat-label">Last Reset</div>
            <div className="stat-value">
              {new Date(user.lastResetDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className="message-button-container">
        <button className="message-button" onClick={handleMessage}>
          <MessageCircle size={20} />
          <span className="message-text">Send Message</span>
        </button>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payment History
          </button>
          <button
            className={`tab-button ${activeTab === "plans" ? "active" : ""}`}
            onClick={() => setActiveTab("plans")}
          >
            Plan History
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "payments" ? (
            <PaymentHistory payments={payments!} />
          ) : (
            <UserPlanHistory plans={userPlans!} />
          )}
        </div>
      </div>
    </div>
  );
};
