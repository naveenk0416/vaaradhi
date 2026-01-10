
import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OnboardingService } from '../../services/onboarding.service';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { Profile, MaritalStatus } from '../../models/profile.model';

@Component({
  selector: 'app-onboarding-wizard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding-wizard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnboardingWizardComponent {
  private fb = inject(FormBuilder);
  private onboardingService = inject(OnboardingService);
  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);

  currentStep = signal(1);
  isSaving = signal(false);
  readonly totalSteps = 5;

  maritalStatuses: MaritalStatus[] = ['Never Married', 'Divorced', 'Widowed', 'Annulled'];

  wizardForm = this.fb.group({
    step1: this.fb.group({
      name: [this.profileService.currentUser().name, Validators.required],
      dob: ['', Validators.required],
      height: ['', Validators.required],
      maritalStatus: ['Never Married' as MaritalStatus, Validators.required],
    }),
    step2: this.fb.group({
      city: ['', Validators.required],
      country: ['', Validators.required],
      religion: ['', Validators.required],
      caste: ['', Validators.required],
      motherTongue: ['', Validators.required],
    }),
    step3: this.fb.group({
      career: ['', Validators.required],
      education: ['', Validators.required],
    }),
    step4: this.fb.group({
      bio: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]],
      interests: ['', Validators.required],
    }),
  });

  // A computed signal to get the form group for the current step
  currentFormGroup = computed(() => {
    return this.wizardForm.get(`step${this.currentStep()}`) as FormGroup;
  });

  nextStep(): void {
    if (this.currentFormGroup().invalid) {
      this.currentFormGroup().markAllAsTouched();
      return;
    }
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  async finish(): Promise<void> {
    if (this.wizardForm.invalid) {
      this.notificationService.show('Incomplete Form', 'Please go back and fill all required fields.');
      return;
    }
    
    this.isSaving.set(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const s1 = this.wizardForm.value.step1!;
    const s2 = this.wizardForm.value.step2!;
    const s3 = this.wizardForm.value.step3!;
    const s4 = this.wizardForm.value.step4!;

    const currentUser = this.profileService.currentUser();
    
    const birthDate = new Date(s1.dob);
    let age = new Date().getFullYear() - birthDate.getFullYear();
    const m = new Date().getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
        age--;
    }

    const updatedProfile: Profile = {
      ...currentUser,
      name: s1.name,
      dob: s1.dob,
      age: age,
      height: s1.height,
      maritalStatus: s1.maritalStatus,
      city: s2.city,
      country: s2.country,
      religion: s2.religion,
      caste: s2.caste,
      motherTongue: s2.motherTongue,
      career: s3.career,
      education: s3.education,
      bio: s4.bio,
      interests: s4.interests.split(',').map((i: string) => i.trim()).filter(Boolean),
      placeOfBirth: s2.city, // Assume place of birth is same as current city for simplicity
      timeOfBirth: '12:00', // Default time
      rashi: '', // These would be calculated by a service
      nakshatra: '',
    };

    this.profileService.updateCurrentUser(updatedProfile);
    this.notificationService.show('Profile Complete!', 'Welcome to Vaaradhi. Start discovering profiles now.');
    this.onboardingService.completeOnboarding();
    this.isSaving.set(false);
  }
}
