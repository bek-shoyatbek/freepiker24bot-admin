export interface UserPlan {
  userId: string;
  planId: string;
  status: "pending" | "active" | "expired";
  startDate: Date;
  endDate: Date;
}
