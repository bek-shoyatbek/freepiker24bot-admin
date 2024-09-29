export interface PaymentInterface {
  userId: string;
  planId: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  chequeImage: string;
}
