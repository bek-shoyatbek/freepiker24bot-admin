import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";
import "./Analytics.css";
import { Axios } from "../../api";

interface User {
  id: string;
  createdAt: string;
}

interface Payment {
  id: string;
  createdAt: string;
  amount: number;
}

interface ChartDataPoint {
  date: string;
  users: number;
  payments: number;
  timestamp: number;
}

interface UserDataPoint {
  date: string;
  count: number;
}

type TimeFilter = "daily" | "weekly" | "all";

export const AnalyticsDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserDataPoint[]>([]);
  const [paymentData, setPaymentData] = useState<ChartDataPoint[]>([]);
  const [filteredData, setFilteredData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [usersResponse, paymentsResponse] = await Promise.all([
          Axios.get("/users?forAnalytics=true"),
          Axios.get("/payments"),
        ]);

        if (!usersResponse.status || !paymentsResponse.status) {
          throw new Error("Failed to fetch data");
        }

        const users: User[] = await usersResponse.data;
        const payments: Payment[] = await paymentsResponse.data;

        const usersByDate = users.reduce<Record<string, number>>(
          (acc, user) => {
            const date = new Date(user.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {}
        );

        const paymentsByDate = payments.reduce<Record<string, number>>(
          (acc, payment) => {
            const date = new Date(payment.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          },
          {}
        );

        const dates = [
          ...new Set([
            ...Object.keys(usersByDate),
            ...Object.keys(paymentsByDate),
          ]),
        ].sort();
        const combinedData: ChartDataPoint[] = dates.map((date) => ({
          date,
          users: usersByDate[date] || 0,
          payments: paymentsByDate[date] || 0,
          timestamp: new Date(date).getTime(),
        }));

        setUserData(
          Object.entries(usersByDate).map(([date, count]) => ({
            date,
            count,
          }))
        );
        setPaymentData(combinedData);
        setFilteredData(combinedData);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch data. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (paymentData.length === 0) return;

    const now = new Date();
    const filterData = (): ChartDataPoint[] => {
      switch (timeFilter) {
        case "daily":
          return paymentData.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === now.toDateString();
          });
        case "weekly": {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return paymentData.filter((item) => {
            const itemDate = new Date(item.date);
            return itemDate >= weekAgo;
          });
        }
        case "all":
        default:
          return paymentData;
      }
    };

    setFilteredData(filterData());
  }, [timeFilter, paymentData]);

  const getTotalUsers = (): number => {
    if (timeFilter === "all") {
      return userData.reduce((acc, curr) => acc + curr.count, 0);
    }
    return filteredData.reduce((acc, curr) => acc + curr.users, 0);
  };

  const getTotalPayments = (): number => {
    return filteredData.reduce((acc, curr) => acc + curr.payments, 0);
  };

  const handleTimeFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setTimeFilter(event.target.value as TimeFilter);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Analytics Dashboard</h2>
        <select
          className="period-selector"
          value={timeFilter}
          onChange={handleTimeFilterChange}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="chart-card">
        <div className="card-header">
          <h3 className="card-title">User & Payment Analytics</h3>
        </div>
        <div className="card-content">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  name="New Users"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="payments"
                  stroke="#82ca9d"
                  name="Payments"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="card-header">
            <h3 className="card-title">Total Users</h3>
          </div>
          <div className="card-content">
            <div className="stat-value">{getTotalUsers()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="card-header">
            <h3 className="card-title">Total Payments</h3>
          </div>
          <div className="card-content">
            <div className="stat-value">{getTotalPayments()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
