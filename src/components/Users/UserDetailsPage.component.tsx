import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserInterface } from "./types/user.interface";
import axios from "axios";
import { API_BASE_URL } from "../../constants";
import { PaymentInterface } from "./types/payment.interface";
import { PaymentHistory } from "./PaymentHistory/PaymentHistory.component";
import { UserPlan } from "./types/user-plan.interface";
import { UserPlanHistory } from "./UserPlanHistory/UserPlanHistory.component";
import "./UserDetailsPage.styles.css";
import { generateAuthHeaders } from "../../helpers/auth/generate-auth-headers.helper";

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
        const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
          headers: generateAuthHeaders(),
          timeout: 10 * 1000,
        });
        setUser(response.data?.data?.user);
        setPayments(response.data?.data?.payments);
        setUserPlans(response.data?.data?.plans);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch user details\n`);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="page-container">
      <h1>{user.name}</h1>
      <div className="profile-image">
        <img
          src={`https://via.placeholder.com/150?text=${user.name}`}
          alt={user.name}
        />
      </div>
      <div className="user-info">
        <p>Username: @{user.username}</p>
        <p>Free Trial Used: {user.freeTrialUsed ? "Yes" : "No"}</p>
        <p>Daily Requests: {user.dailyRequestsCount}</p>
        <p>Last Reset: {new Date(user.lastResetDate).toLocaleDateString()}</p>
      </div>
      <div className="tab-buttons">
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
          User Plans History
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
  );
};
