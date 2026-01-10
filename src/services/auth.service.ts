import { HttpClient } from "@angular/common/http";
import { Injectable, signal, inject, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import {
  firstValueFrom,
  Subject,
  Subscription,
  switchMap,
  tap,
  timer,
} from "rxjs";
import { environment } from "../../environments/environment"; // Import here

import { GoogleAuthService } from './google-auth.service';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private router = inject(Router);
  private googleAuthService = inject(GoogleAuthService);
  isLoggedIn = signal<boolean>(false);
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/api/auth`;
  currentUser = signal<any>(null);
  private ngZone = inject(NgZone);

  private readonly TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes  private userActivity$ = new Subject<void>();
  private idleSubscription?: Subscription;
  private userActivity$ = new Subject<void>();
  constructor() {
    this.setupInactivityTimer();
  }

  async login(email: string, password: string) {
    const response = await firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/login`, { email, password })
    );

    if (response.token) {
      // Save to Browser Storage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      this.currentUser.set(response.user);
      
    }
    this.isLoggedIn.set(true);
    return response;
  }

  async signup(name: string, email: string, password: string): Promise<any> {
    const url = `${this.apiUrl}/signup`;
    return await firstValueFrom(this.http.post(url, { name, email, password }));
  }

  forgotPassword(email: string): Promise<void> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would trigger a password reset email
        resolve();
      }, 1000);
    });
  }

  async signInWithGoogle(): Promise<void> {
    await this.googleAuthService.signIn();
    this.isLoggedIn.set(true);
    this.router.navigate(['/discover']);
  }

  logout(): void {
    this.isLoggedIn.set(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.currentUser.set(null);
    this.router.navigate(["/login"]);
  }
  checkSession() {
    const user = localStorage.getItem("user");
    if (user) this.currentUser.set(JSON.parse(user));
  }

  private setupInactivityTimer() {
    this.idleSubscription = this.userActivity$
      .pipe(
        switchMap(() => timer(this.TIMEOUT_MS)),
        tap(() => console.log("Inactivity timeout reached"))
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.logout();
        });
      });
  }

  stopInactivityMonitoring() {
    this.idleSubscription?.unsubscribe();
  }

  refreshActivity() {
    this.userActivity$.next();
  }
  initSession() {
    this.refreshActivity();
  }
}
