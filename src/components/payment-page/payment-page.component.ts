
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SubscriptionPlan } from '../../models/subscription.model';
import { PaymentService } from '../../services/payment.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentPageComponent {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private notificationService = inject(NotificationService);

  plans = signal<SubscriptionPlan[]>([
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 29.99,
      durationMonths: 1,
      pricePerMonth: 29.99,
      features: ['Unlimited Profile Views', 'Send 50 Interests', 'Basic Chat Features', 'View 5 Horoscopes'],
      bestValue: false,
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      price: 74.99,
      durationMonths: 3,
      pricePerMonth: 24.99,
      features: ['Unlimited Profile Views', 'Send 150 Interests', 'Advanced Chat Features', 'View 20 Horoscopes', 'Profile Boost'],
      bestValue: true,
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 239.99,
      durationMonths: 12,
      pricePerMonth: 19.99,
      features: ['All Quarterly Features', 'Dedicated Support', 'View Unlimited Horoscopes', 'See Who Liked You'],
      bestValue: false,
    }
  ]);

  selectedPlan = signal<SubscriptionPlan>(this.plans()[1]); // Default to best value
  paymentStatus = signal<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  // FAQ state
  openFaq = signal<number | null>(null);

  paymentForm = this.fb.group({
    cardholderName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  selectPlan(plan: SubscriptionPlan) {
    this.selectedPlan.set(plan);
  }

  toggleFaq(index: number) {
    this.openFaq.update(current => (current === index ? null : index));
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.paymentStatus.set('processing');
    try {
      const result = await this.paymentService.processPayment(this.selectedPlan(), this.paymentForm.value as any);
      this.paymentStatus.set('success');
      this.notificationService.show('Payment Successful', `Your ${this.selectedPlan().name} plan is now active!`);
    } catch(error: any) {
      this.paymentStatus.set('error');
      this.notificationService.show('Payment Failed', error?.message || 'An unknown error occurred.');
      // After a moment, reset to idle to allow user to try again
      setTimeout(() => this.paymentStatus.set('idle'), 3000);
    }
  }

  get cardholderName() { return this.paymentForm.get('cardholderName'); }
  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get expiryDate() { return this.paymentForm.get('expiryDate'); }
  get cvc() { return this.paymentForm.get('cvc'); }
}
