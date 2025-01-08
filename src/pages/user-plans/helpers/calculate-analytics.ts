import { PLAN_PRICES } from "../constants";
import { PaymentData } from "../types/payments-data";
import { calculateTotalAmount } from "./calculate-total-amount";

export const calculateAnalytics = (data: PaymentData[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekPayments = data.filter(
        (payment) => new Date(payment.startDate) >= oneWeekAgo
    );

    const thisMonthPayments = data.filter(
        (payment) => new Date(payment.startDate) >= oneMonthAgo
    );

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