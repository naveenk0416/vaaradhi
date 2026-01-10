
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SubscriptionPlan } from '../../models/subscription.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  isSubmitting = signal(false);
  loginError = signal<string | null>(null);
  currentYear = new Date().getFullYear();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

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

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isSubmitting.set(true);
    this.loginError.set(null);
    
    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email!, password!);
    } catch (error) {
      this.loginError.set('Invalid email or password. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async handleGoogleSignIn(): Promise<void> {
    this.isSubmitting.set(true);
    this.loginError.set(null);
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      this.loginError.set('Could not sign in with Google. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
