import { PLAN_PRICES } from "../constants";
import { PaymentsData } from "../types/payments-data";

export const calculateTotalAmount = (payments: PaymentsData[]) => {
    return payments.reduce((total, payment) => {
        return total + PLAN_PRICES[payment.plan as keyof typeof PLAN_PRICES];
    }, 0);
};