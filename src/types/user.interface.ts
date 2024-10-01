export interface UserInterface {
  _id: string;
  telegramId: string;
  name: string;
  username?: string;
  freeTrialUsed: boolean;
  dailyRequestsCount: number;
  lastResetDate: Date;
}
