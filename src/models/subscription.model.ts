
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  pricePerMonth: number;
  features: string[];
  bestValue: boolean;
}
