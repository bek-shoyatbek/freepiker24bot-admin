import { PaymentInterface } from "../../../types/payment.interface";
import "../../../commons/history-table.styles.css";
export const PaymentHistory = ({
  payments,
}: {
  payments: PaymentInterface[];
}) => {
  if (!payments || payments.length === 0) {
    return <p>No payment history available.</p>;
  }

  return (
    <div className="history">
      <h2>Payment History</h2>
      <div className="table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th scope="col">Plan ID</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Cheque Image</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.planId}</td>
                <td>${payment.amount.toFixed(2)}</td>
                <td>
                  <span className={`status ${payment.status}`}>
                    {payment.status}
                  </span>
                </td>
                <td>
                  <img
                    src={payment.chequeImage}
                    alt={`Cheque for payment ${payment.planId}`}
                    className="cheque-image"
                    onClick={() => window.open(payment.chequeImage, "_blank")}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        window.open(payment.chequeImage, "_blank");
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View cheque image for payment ${payment.planId}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
