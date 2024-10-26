import { useState, useEffect } from "react";
import "./Payments.css";
import { Axios } from "../../Api/axios";
import { PaymentsData } from "./types/payments-data";
import { useNavigate } from "react-router-dom";

const PLAN_PRICES = {
  BASIC: 19000,
  STANDARD: 29000,
  PREMIUM: 39000,
};

export const Payments = () => {
  const [payments, setPayments] = useState<PaymentsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
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

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Fetches the list of payments from the server.
   * Sets the loading state to true while fetching data.
   * On success, updates the payments state with the fetched data and clears any error messages.
   * On failure, sets an error message indicating the fetch failure.
   * Finally, resets the loading state to false.
   */
  /******  ee2e8f9c-3c9e-47cd-b07d-c441df77dd4f  *******/
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/payments");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    // Convert dates to timestamps for comparison
    if (key === "startDate" || key === "endDate") {
      const dateA = new Date(a[key]).getTime();
      const dateB = new Date(b[key]).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Handle string comparisons
    if (typeof a[key] === "string") {
      const compareResult = a[key].localeCompare(b[key]);
      return direction === "asc" ? compareResult : -compareResult;
    }

    // Handle number comparisons
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

  const calculateAnalytics = (data: PaymentsData[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekPayments = data.filter(
      (payment) => new Date(payment.startDate) >= oneWeekAgo
    );

    const thisMonthPayments = data.filter(
      (payment) => new Date(payment.startDate) >= oneMonthAgo
    );

    const calculateTotalAmount = (payments: PaymentsData[]) => {
      return payments.reduce((total, payment) => {
        return total + PLAN_PRICES[payment.plan as keyof typeof PLAN_PRICES];
      }, 0);
    };

    const planCounts = {
      BASIC: data.filter((p) => p.plan === "BASIC").length,
      STANDARD: data.filter((p) => p.plan === "STANDARD").length,
      PREMIUM: data.filter((p) => p.plan === "PREMIUM").length,
    };

    return {
      totalPayments: data.length,
      thisWeekPayments: thisWeekPayments.length,
      thisMonthPayments: thisMonthPayments.length,
      totalAmount: calculateTotalAmount(data),
      thisWeekAmount: calculateTotalAmount(thisWeekPayments),
      thisMonthAmount: calculateTotalAmount(thisMonthPayments),
      planCounts,
      planRevenue: {
        BASIC: planCounts.BASIC * PLAN_PRICES.BASIC,
        STANDARD: planCounts.STANDARD * PLAN_PRICES.STANDARD,
        PREMIUM: planCounts.PREMIUM * PLAN_PRICES.PREMIUM,
      },
    };
  };

  const renderAnalytics = () => {
    const analytics = calculateAnalytics(payments);

    return (
      <div className="analytics-container">
        <div className="analytics-grid">
          <div className="analytics-card total-payments">
            <h3>Total Payments</h3>
            <div className="analytics-value">{analytics.totalPayments}</div>
            <div className="analytics-subtitle">All time</div>
          </div>

          <div className="analytics-card">
            <h3>Recent Activity</h3>
            <div className="analytics-row">
              <span>This Week</span>
              <span>{analytics.thisWeekPayments} payments</span>
            </div>
            <div className="analytics-row">
              <span>This Month</span>
              <span>{analytics.thisMonthPayments} payments</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Revenue</h3>
            <div className="analytics-row">
              <span>Total Revenue</span>
              <span>{analytics.totalAmount.toLocaleString()} sum</span>
            </div>
            <div className="analytics-row">
              <span>This Month</span>
              <span>{analytics.thisMonthAmount.toLocaleString()} sum</span>
            </div>
          </div>

          <div className="analytics-card">
            <h3>Plan Distribution</h3>
            <div className="analytics-row">
              <span>Basic ({PLAN_PRICES.BASIC.toLocaleString()} sum)</span>
              <span>{analytics.planCounts.BASIC} users</span>
            </div>
            <div className="analytics-row">
              <span>
                Standard ({PLAN_PRICES.STANDARD.toLocaleString()} sum)
              </span>
              <span>{analytics.planCounts.STANDARD} users</span>
            </div>
            <div className="analytics-row">
              <span>Premium ({PLAN_PRICES.PREMIUM.toLocaleString()} sum)</span>
              <span>{analytics.planCounts.PREMIUM} users</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading-state">Loading payments...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="payments-container">
      {renderAnalytics()}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
