
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private router = inject(Router);
  isLoggedIn = signal<boolean>(false);

  login(email: string, password: string): Promise<void> {
    // Simulate API call with hardcoded admin credentials
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@vaaradhi.com' && password === 'admin123') {
          this.isLoggedIn.set(true);
          this.router.navigate(['/admin/dashboard']);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.router.navigate(['/admin/login']);
  }
}
