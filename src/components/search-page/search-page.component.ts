
import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { Profile } from '../../models/profile.model';
import { DetailedProfileComponent } from '../detailed-profile/detailed-profile.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  imports: [
    CommonModule, 
    NgOptimizedImage,
    ReactiveFormsModule, 
    DetailedProfileComponent
  ],
})
export class SearchPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);

  searchForm!: FormGroup;
  isProfessionalInfoOpen = signal(true);
  isLocationInfoOpen = signal(true);
  
  private allSearchableProfiles = computed(() => {
    const all = this.profileService.discoverableProfiles().concat(this.profileService.likedProfiles());
    // Remove duplicates
    return all.filter((p, i, self) => i === self.findIndex(t => t.id === p.id));
  });

  filteredProfiles = signal<Profile[]>([]);
  selectedProfile = signal<Profile | null>(null);

  isSelectedProfileLiked = computed(() => {
    const selected = this.selectedProfile();
    if (!selected) return false;
    return this.profileService.likedProfiles().some(p => p.id === selected.id);
  });

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      career: [''],
      education: [''],
      interests: [''],
      willingToRelocate: [false],
      preferredCountries: [{ value: '', disabled: true }],
    });

    this.filteredProfiles.set(this.allSearchableProfiles());

    this.searchForm.get('willingToRelocate')?.valueChanges.subscribe(value => {
      const preferredCountriesControl = this.searchForm.get('preferredCountries');
      if (value) {
        preferredCountriesControl?.enable();
      } else {
        preferredCountriesControl?.disable();
        preferredCountriesControl?.reset('');
      }
    });

    this.searchForm.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const filters = this.searchForm.value;
    let profiles = this.allSearchableProfiles();

    if (filters.career) {
      profiles = profiles.filter(p => p.career.toLowerCase().includes(filters.career.toLowerCase()));
    }

    if (filters.education) {
      profiles = profiles.filter(p => p.education.toLowerCase().includes(filters.education.toLowerCase()));
    }

    if (filters.interests) {
      const searchInterests = filters.interests.split(',').map((i: string) => i.trim().toLowerCase()).filter(Boolean);
      if (searchInterests.length > 0) {
        profiles = profiles.filter(p => 
          searchInterests.some((interest: string) => 
            p.interests.some(pi => pi.toLowerCase().includes(interest))
          )
        );
      }
    }

    if (filters.willingToRelocate) {
      profiles = profiles.filter(p => p.preferences.willingToRelocate);
      
      if (filters.preferredCountries) {
        const searchCountries = filters.preferredCountries.split(',').map((c: string) => c.trim().toLowerCase()).filter(Boolean);
        if (searchCountries.length > 0) {
          profiles = profiles.filter(p =>
            searchCountries.some((country: string) =>
              p.preferences.preferredCountries.some(pc => pc.toLowerCase().includes(country))
            )
          );
        }
      }
    }

    this.filteredProfiles.set(profiles);
  }

  resetFilters(): void {
    this.searchForm.reset({
      career: '',
      education: '',
      interests: '',
      willingToRelocate: false,
      preferredCountries: { value: '', disabled: true },
    });
    // This will trigger valueChanges and re-apply filters with empty values
  }
  
  viewProfile(profile: Profile): void {
    this.selectedProfile.set(profile);
  }

  onInterestSent(profile: Profile): void {
    this.profileService.likeProfile(profile);
    this.notificationService.show('Interest Sent!', `${profile.name} has been added to your matches.`);
  }

  closeDetailedProfile(): void {
    this.selectedProfile.set(null);
  }
}
