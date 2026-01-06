
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  
  isSubmitting = signal(false);
  message = signal<string | null>(null);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    
    this.isSubmitting.set(true);
    this.message.set(null);
    
    try {
      const { email } = this.forgotPasswordForm.value;
      await this.authService.forgotPassword(email!);
      this.message.set('If an account with this email exists, a password reset link has been sent.');
      this.forgotPasswordForm.reset();
    } catch (error) {
      this.message.set('An error occurred. Please try again later.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
