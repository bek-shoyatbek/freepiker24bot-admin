import { IMessage } from "./Message.interface";

export interface MessageDeliveryStatus {
    totalAttempts: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    deliveryRate: number;
    errorBreakdown: any[];
    deliveryTimeDistribution: any[];
}

export interface MessageWithDelivery extends IMessage {
    deliveryStatus?: MessageDeliveryStatus;
    isLoadingStatus?: boolean;
}