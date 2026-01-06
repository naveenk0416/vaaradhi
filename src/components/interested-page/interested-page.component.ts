
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { Profile } from '../../models/profile.model';
import { DetailedProfileComponent } from '../detailed-profile/detailed-profile.component';

@Component({
  selector: 'app-interested-page',
  templateUrl: './interested-page.component.html',
  imports: [
    CommonModule,
    NgOptimizedImage,
    DetailedProfileComponent
  ],
})
export class InterestedPageComponent {
  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);

  interestedProfiles = this.profileService.likedProfiles;
  selectedProfile = signal<Profile | null>(null);

  // Since all profiles on this page are liked, this will always be true
  // when a profile is selected.
  isSelectedProfileLiked = computed(() => !!this.selectedProfile());

  viewProfile(profile: Profile): void {
    this.selectedProfile.set(profile);
  }

  // The 'interestSent' output from the detailed view is handled here.
  // In this context, it's just a confirmation, so we can show a notification.
  onInterestSent(profile: Profile): void {
    // The profile is already liked, but we can re-like to be safe or just show a notification.
    this.profileService.likeProfile(profile);
    this.notificationService.show('Interest Confirmed!', `You have already shown interest in ${profile.name}.`);
  }

  closeDetailedProfile(): void {
    this.selectedProfile.set(null);
  }
}
