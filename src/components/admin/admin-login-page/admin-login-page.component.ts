
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login-page',
  templateUrl: './admin-login-page.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
})
export class AdminLoginPageComponent {
  private fb = inject(FormBuilder);
  private adminAuthService = inject(AdminAuthService);
  
  isSubmitting = signal(false);
  loginError = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['admin@vaaradhi.com', [Validators.required, Validators.email]],
    password: ['admin123', Validators.required],
  });

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isSubmitting.set(true);
    this.loginError.set(null);
    
    try {
      const { email, password } = this.loginForm.value;
      await this.adminAuthService.login(email!, password!);
    } catch (error) {
      this.loginError.set('Invalid email or password. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
