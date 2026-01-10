
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
    private router = inject(Router);

  
  isSubmitting = signal(false);
  loginError = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

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
      this.router.navigate(['discover'])
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
