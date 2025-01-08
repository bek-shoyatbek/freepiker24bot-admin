export interface PaymentData {
    id: string,
    userId: string,
    username: string,
    from?: string,
    plan: string,
    status: string,
    startDate: string,
    endDate: string
}