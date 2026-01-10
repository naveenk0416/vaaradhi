
import { Component, ChangeDetectionStrategy, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, catchError, filter } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';
import { AstrologyService } from '../../services/astrology.service';
import { LocationService } from '../../services/location.service';
import { Profile, VisaStatus, MaritalStatus, HousingStatus } from '../../models/profile.model';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  imports: [CommonModule, ReactiveFormsModule, ProfileCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host app-profile-card {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  private fb: FormBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private astrologyService = inject(AstrologyService);
  private locationService = inject(LocationService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  isEditing = signal(false);
  currentUser = this.profileService.currentUser;
  profileForm!: FormGroup;
  visaStatuses: VisaStatus[] = ['Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa'];
  maritalStatuses: MaritalStatus[] = ['Never Married', 'Divorced', 'Widowed', 'Annulled'];
  housingStatuses: HousingStatus[] = ['Owns House', 'Rents', 'Lives with Family'];
  isSaving = signal(false);
  
  // Photo upload state
  isUploadingPhoto = signal(false);
  uploadProgress = signal(0);
  photoUploadError = signal<string | null>(null);

  // Autocomplete signals
  placeOfBirthSuggestions = signal<string[]>([]);
  showPlaceOfBirthSuggestions = signal(false);
  countrySuggestions = signal<string[]>([]);
  showCountrySuggestions = signal(false);
  cityAutocompleteError = signal<string | null>(null);
  countryAutocompleteError = signal<string | null>(null);

  // For desktop image gallery
  currentDesktopImageIndex = signal(0);

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      height: ['', Validators.required],
      maritalStatus: [null, Validators.required],
      housingStatus: [null, Validators.required],
      dob: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      timeOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      visaStatus: [null, Validators.required],
      religion: ['', Validators.required],
      caste: ['', Validators.required],
      motherTongue: ['', Validators.required],
      career: ['', Validators.required],
      education: ['', Validators.required],
      bio: ['', [Validators.required, Validators.maxLength(500)]],
      interests: ['', Validators.required],
      willingToRelocate: [false],
      preferredCountries: [''],
    });

    // Handle initial route state
    this.handleUrl(this.router.url);

    // Subscribe to router events for subsequent navigations to toggle edit mode
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(e => {
      this.handleUrl(e.urlAfterRedirects);
    });

    this.setupAutocomplete();
  }
  
  private handleUrl(url: string): void {
    if (url.endsWith('/edit')) {
      this.isEditing.set(true);
      this.populateFormForEdit();
    } else {
      this.isEditing.set(false);
    }
  }
  
  private populateFormForEdit(): void {
    const user = this.currentUser();
    this.profileForm.reset({
      name: user.name,
      age: user.age,
      height: user.height,
      maritalStatus: user.maritalStatus,
      housingStatus: user.housingStatus,
      dob: user.dob,
      placeOfBirth: user.placeOfBirth,
      timeOfBirth: user.timeOfBirth,
      city: user.city,
      country: user.country,
      visaStatus: user.visaStatus,
      religion: user.religion,
      caste: user.caste,
      motherTongue: user.motherTongue,
      career: user.career,
      education: user.education,
      bio: user.bio,
      interests: user.interests.join(', '),
      willingToRelocate: user.preferences.willingToRelocate,
      preferredCountries: user.preferences.preferredCountries.join(', '),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAutocomplete(): void {
    // Place of Birth Autocomplete
    this.profileForm.get('placeOfBirth')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.locationService.getCitySuggestions(query).pipe(
        catchError(err => {
          console.error('Failed to get city suggestions:', err);
          this.cityAutocompleteError.set('Could not load city suggestions.');
          this.showPlaceOfBirthSuggestions.set(false);
          return of([]);
        })
      )),
      takeUntil(this.destroy$)
    ).subscribe(suggestions => {
      this.cityAutocompleteError.set(null);
      this.placeOfBirthSuggestions.set(suggestions);
      this.showPlaceOfBirthSuggestions.set(suggestions.length > 0);
    });

    // Country Autocomplete
    this.profileForm.get('country')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => this.locationService.getCountrySuggestions(query).pipe(
        catchError(err => {
          console.error('Failed to get country suggestions:', err);
          this.countryAutocompleteError.set('Could not load country suggestions.');
          this.showCountrySuggestions.set(false);
          return of([]);
        })
      )),
      takeUntil(this.destroy$)
    ).subscribe(suggestions => {
      this.countryAutocompleteError.set(null);
      this.countrySuggestions.set(suggestions);
      this.showCountrySuggestions.set(suggestions.length > 0);
    });
  }

  selectSuggestion(field: 'placeOfBirth' | 'country', value: string): void {
    this.profileForm.get(field)?.setValue(value, { emitEvent: false });
    if (field === 'placeOfBirth') {
      this.showPlaceOfBirthSuggestions.set(false);
    } else {
      this.showCountrySuggestions.set(false);
    }
  }

  startEditing(): void {
    this.router.navigate(['/profile/edit']);
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isSaving.set(true);

    try {
      const formValue = this.profileForm.value;

      // Automatically calculate astrological details from birth info
      const { rashi, nakshatra } = await this.astrologyService.getAstroDetails(
        formValue.dob, 
        formValue.timeOfBirth, 
        formValue.placeOfBirth
      );

      const updatedProfile: Profile = {
        ...this.currentUser(),
        name: formValue.name,
        age: formValue.age,
        height: formValue.height,
        maritalStatus: formValue.maritalStatus,
        housingStatus: formValue.housingStatus,
        dob: formValue.dob,
        placeOfBirth: formValue.placeOfBirth,
        timeOfBirth: formValue.timeOfBirth,
        rashi: rashi,
        nakshatra: nakshatra,
        city: formValue.city,
        country: formValue.country,
        visaStatus: formValue.visaStatus,
        religion: formValue.religion,
        caste: formValue.caste,
        motherTongue: formValue.motherTongue,
        career: formValue.career,
        education: formValue.education,
        bio: formValue.bio,
        interests: formValue.interests.split(',').map((i: string) => i.trim()).filter((i: string) => i),
        preferences: {
          willingToRelocate: formValue.willingToRelocate,
          preferredCountries: formValue.preferredCountries.split(',').map((c: string) => c.trim()).filter((c: string) => c),
        },
      };

      this.profileService.updateCurrentUser(updatedProfile);
      this.router.navigate(['/profile']);
    } catch (error) {
      // In a real app, you might show an error notification here
      console.error("Failed to save profile:", error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.photoUploadError.set(null);

    if (!file.type.startsWith('image/')) {
      this.photoUploadError.set('Please select a valid image file (e.g., JPG, PNG).');
      input.value = '';
      return;
    }

    const MAX_SIZE_MB = 5;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      this.photoUploadError.set(`File is too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      input.value = '';
      return;
    }

    this.isUploadingPhoto.set(true);
    this.uploadProgress.set(0);

    try {
      const base64String = await this.readFileAsDataURL(file);
      await this.simulateUploadWithProgress();

      const updatedProfile: Profile = {
        ...this.currentUser(),
        imageUrls: [...this.currentUser().imageUrls, base64String],
        verification: {
          ...this.currentUser().verification,
          isProfilePictureVerified: false,
        },
      };
      this.profileService.updateCurrentUser(updatedProfile);
      
      // Keep the 100% progress bar visible for a moment before hiding
      setTimeout(() => {
        this.isUploadingPhoto.set(false);
      }, 500);

    } catch (error) {
      this.photoUploadError.set(typeof error === 'string' ? error : 'An unknown error occurred.');
      this.isUploadingPhoto.set(false); // Hide progress bar on error
    } finally {
      input.value = ''; // Clear the input regardless of outcome
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject('There was an error reading the file.');
      reader.readAsDataURL(file);
    });
  }

  private simulateUploadWithProgress(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.uploadProgress.set(0);
      const interval = setInterval(() => {
        this.uploadProgress.update(p => {
          const newProgress = p + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 120);

      setTimeout(() => {
        clearInterval(interval);
        if (Math.random() < 0.2) { // Simulate 20% failure rate
          this.uploadProgress.set(0);
          reject('Upload failed. Please check your connection and try again.');
        } else {
          this.uploadProgress.set(100);
          setTimeout(() => resolve(), 300);
        }
      }, 1500);
    });
  }

  cancel(): void {
    this.isUploadingPhoto.set(false);
    this.photoUploadError.set(null);
    this.router.navigate(['/profile']);
  }

  setDesktopImage(index: number): void {
    this.currentDesktopImageIndex.set(index);
  }
}
