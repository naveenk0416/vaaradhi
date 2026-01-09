
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

// Custom validator to check if passwords match
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword?.setErrors({ passwordsMismatch: true });
    return { passwordsMismatch: true };
  }
  
  return null;
}

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  
  isSubmitting = signal(false);
  signupError = signal<string | null>(null);

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatchValidator });

  async onSubmit(): Promise<void> {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) {
      return;
    }
    
    this.isSubmitting.set(true);
    this.signupError.set(null);
    
    try {
      const { name, email, password } = this.signupForm.value;
      await this.authService.signup(name!, email!, password!);
    } catch (error) {
      this.signupError.set('Could not create account. Please try again.');
    } finally {
      this.isSubmitting.set(false);
      this.router.navigate(['login'])
      
    }
  }


}

