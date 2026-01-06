
import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { AstrologyService } from '../../../services/astrology.service';
import { Profile, VisaStatus, MaritalStatus, UserCategory } from '../../../models/profile.model';

@Component({
  selector: 'app-admin-profile-form',
  templateUrl: './admin-profile-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class AdminProfileFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private astrologyService = inject(AstrologyService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  profileForm!: FormGroup;
  isEditMode = signal(false);
  editingProfileId: number | null = null;
  isSaving = signal(false);

  // Enum values for template
  visaStatuses: VisaStatus[] = ['Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa'];
  maritalStatuses: MaritalStatus[] = ['Never Married', 'Divorced', 'Widowed', 'Annulled'];
  userCategories: UserCategory[] = ['INDIA', 'NRI'];

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      height: ['', Validators.required],
      maritalStatus: ['Never Married', Validators.required],
      dob: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      timeOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      visaStatus: ['Citizen', Validators.required],
      religion: ['', Validators.required],
      caste: ['', Validators.required],
      motherTongue: ['', Validators.required],
      career: ['', Validators.required],
      education: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(500)]],
      userCategory: ['NRI', Validators.required],
      imageUrls: ['', Validators.required],
      interests: ['', Validators.required],
      isIdVerified: [false],
      isNriVerified: [false],
      isProfilePictureVerified: [false],
      willingToRelocate: [false],
      preferredCountries: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editingProfileId = +id;
      const existingProfile = this.profileService.getProfileById(this.editingProfileId);
      if (existingProfile) {
        this.populateForm(existingProfile);
      } else {
        // Handle case where profile not found, maybe redirect
        this.router.navigate(['/admin/profiles']);
      }
    }
  }

  private populateForm(profile: Profile): void {
    this.profileForm.patchValue({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      age: profile.age,
      height: profile.height,
      maritalStatus: profile.maritalStatus,
      dob: profile.dob,
      placeOfBirth: profile.placeOfBirth,
      timeOfBirth: profile.timeOfBirth,
      city: profile.city,
      country: profile.country,
      visaStatus: profile.visaStatus,
      religion: profile.religion,
      caste: profile.caste,
      motherTongue: profile.motherTongue,
      career: profile.career,
      education: profile.education,
      bio: profile.bio,
      userCategory: profile.userCategory,
      imageUrls: profile.imageUrls.join(', '),
      interests: profile.interests.join(', '),
      isIdVerified: profile.verification.isIdVerified,
      isNriVerified: profile.verification.isNriVerified,
      isProfilePictureVerified: profile.verification.isProfilePictureVerified,
      willingToRelocate: profile.preferences.willingToRelocate,
      preferredCountries: profile.preferences.preferredCountries.join(', '),
    });
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isSaving.set(true);
    const formValue = this.profileForm.value;

    const { rashi, nakshatra } = await this.astrologyService.getAstroDetails(
      formValue.dob, 
      formValue.timeOfBirth, 
      formValue.placeOfBirth
    );

    const profileData: Omit<Profile, 'id'> = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      age: formValue.age,
      imageUrls: formValue.imageUrls.split(',').map((url: string) => url.trim()).filter(Boolean),
      city: formValue.city,
      country: formValue.country,
      bio: formValue.bio,
      interests: formValue.interests.split(',').map((i: string) => i.trim()).filter(Boolean),
      verification: {
        isIdVerified: formValue.isIdVerified,
        isNriVerified: formValue.isNriVerified,
        isProfilePictureVerified: formValue.isProfilePictureVerified,
      },
      visaStatus: formValue.visaStatus,
      career: formValue.career,
      education: formValue.education,
      maritalStatus: formValue.maritalStatus,
      religion: formValue.religion,
      caste: formValue.caste,
      motherTongue: formValue.motherTongue,
      height: formValue.height,
      dob: formValue.dob,
      placeOfBirth: formValue.placeOfBirth,
      timeOfBirth: formValue.timeOfBirth,
      rashi: rashi,
      nakshatra: nakshatra,
      userCategory: formValue.userCategory,
      preferences: {
        willingToRelocate: formValue.willingToRelocate,
        preferredCountries: formValue.preferredCountries.split(',').map((c: string) => c.trim()).filter(Boolean),
      },
    };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (this.isEditMode() && this.editingProfileId) {
      this.profileService.updateProfileById(this.editingProfileId, profileData);
    } else {
      this.profileService.createProfile(profileData);
    }
    
    this.isSaving.set(false);
    this.router.navigate(['/admin/profiles']);
  }
}