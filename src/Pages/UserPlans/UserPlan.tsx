import { useState, useEffect } from "react";
import "./UserPlan.css";
import { Axios } from "../../Api/axios";
import { PaymentsData } from "./types/payments-data";
import { useNavigate } from "react-router-dom";
import { formatDate, renderAnalytics } from "./helpers";

export const UserPlan = () => {
  const [payments, setPayments] = useState<PaymentsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({
    key: "startDate",
    direction: "desc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/user-plans");
      if (response.data?.data) {
        setPayments(response.data.data);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch payments data. Please try again later.");
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userPlanId: string) => {
    if (!window.confirm("Are you sure you want to delete this user plan?")) {
      return;
    }

    try {
      setDeleteLoading(userPlanId);
      await Axios.delete(`/user-plans/${userPlanId}`);
      setPayments(payments.filter((payment) => payment.userId !== userPlanId));
    } catch (err) {
      setError("Failed to delete user plan. Please try again later.");
      console.error("Error deleting user plan:", err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig?.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const filteredData = payments.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "ALL" || item.plan === selectedPlan;
    const matchesStatus =
      selectedStatus === "ALL" || item.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const sortData = (a: any, b: any, key: string, direction: "asc" | "desc") => {
    if (key === "startDate" || key === "endDate") {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (typeof a[key] === "string") {
      const compareResult = a[key].localeCompare(b[key]);
      return direction === "asc" ? compareResult : -compareResult;
    }

    const valueA = a[key];
    const valueB = b[key];
    return direction === "asc" ? valueA - valueB : valueB - valueA;
  };

  const sortedData = [...filteredData].sort((a, b) =>
    sortData(
      a,
      b,
      sortConfig?.key as string,
      sortConfig?.direction as "asc" | "desc"
    )
  );

  if (loading) {
    return <div className="loading-state">Loading payments...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="payments-container">
      {renderAnalytics(payments)}
      <div className="payments-header">
        <h1>Payments</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search by username or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Plans</option>
            <option value="BASIC">Basic</option>
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("username")}>Username</th>
              <th onClick={() => handleSort("plan")}>Plan</th>
              <th onClick={() => handleSort("status")}>Status</th>
              <th onClick={() => handleSort("startDate")}>Start Date</th>
              <th onClick={() => handleSort("endDate")}>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((payment, index) => (
              <tr key={index}>
                <td>
                  <div
                    onClick={() => handleUserClick(payment.userId)}
                    className="username-link"
                  >
                    {payment.username}
                    <span className="user-id">{payment.userId}</span>
                  </div>
                </td>
                <td>
                  <span className={`plan-badge ${payment.plan.toLowerCase()}`}>
                    {payment.plan}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td>{formatDate(payment.startDate)}</td>
                <td>{formatDate(payment.endDate)}</td>
                <td>
                  <button
                    className={`delete-button ${
                      deleteLoading === payment.userId ? "loading" : ""
                    }`}
                    onClick={() => handleDelete(payment.userId)}
                    disabled={deleteLoading === payment.userId}
                  >
                    {deleteLoading === payment.userId
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
