
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-admin-profile-list',
  templateUrl: './admin-profile-list.component.html',
  imports: [CommonModule, RouterLink],
})
export class AdminProfileListComponent {
  private profileService = inject(ProfileService);

  profiles = this.profileService.getAllProfiles();
  
  deleteProfile(profile: Profile): void {
    if (confirm(`Are you sure you want to delete the profile for ${profile.name}? This action cannot be undone.`)) {
      this.profileService.deleteProfile(profile.id);
    }
  }
}
