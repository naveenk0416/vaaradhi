
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  showWizard = signal(false);

  /**
   * Triggers the onboarding wizard to be displayed.
   * In a real application, this would be conditional on a user property like `isProfileComplete`.
   * For this simulation, we'll trigger it manually after every signup.
   */
  startOnboarding(): void {
    this.showWizard.set(true);
  }

  /**
   * Hides the onboarding wizard.
   */
  completeOnboarding(): void {
    this.showWizard.set(false);
  }
}
