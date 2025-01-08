import { PLAN_PRICES } from "../constants";
import { calculateAnalytics } from ".";
import { PaymentData } from "../types/payments-data";

export const renderAnalytics = (payments: PaymentData[]) => {
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
            <span>Standard ({PLAN_PRICES.STANDARD.toLocaleString()} sum)</span>
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
