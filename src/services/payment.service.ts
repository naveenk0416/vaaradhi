
import { Injectable } from '@angular/core';
import { SubscriptionPlan } from '../models/subscription.model';

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  // Simulate processing payment with a payment gateway
  processPayment(plan: SubscriptionPlan, paymentDetails: PaymentDetails): Promise<{ success: boolean; message: string; }> {
    console.log('Processing payment for:', plan.name);
    console.log('Payment details:', paymentDetails);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a 90% success rate
        if (Math.random() < 0.9 && paymentDetails.cvc !== '123') { // Add a simple fail condition for testing
          resolve({ success: true, message: 'Payment successful! Your subscription is now active.' });
        } else {
          reject({ success: false, message: 'Payment failed. Please check your card details and try again.' });
        }
      }, 2000); // Simulate 2-second processing time
    });
  }
}
