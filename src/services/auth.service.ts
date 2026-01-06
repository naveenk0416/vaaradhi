
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  isLoggedIn = signal<boolean>(false);

  login(email: string, password: string): Promise<void> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        this.isLoggedIn.set(true);
        this.router.navigate(['/discover']);
        resolve();
      }, 1000);
    });
  }

  signup(name: string, email: string, password: string): Promise<void> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        this.isLoggedIn.set(true);
        this.router.navigate(['/discover']);
        resolve();
      }, 1000);
    });
  }
  
  forgotPassword(email: string): Promise<void> {
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        // In a real app, this would trigger a password reset email
        resolve();
      }, 1000);
    });
  }

  logout(): void {
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
