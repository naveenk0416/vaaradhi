
import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { KundaliService, KundaliMatch } from '../../services/kundali.service';
import { Profile } from '../../models/profile.model';
import { DetailedProfileComponent } from '../detailed-profile/detailed-profile.component';
import { KundaliScoreComponent } from '../kundali-score/kundali-score.component';

@Component({
  selector: 'app-interested-page',
  templateUrl: './interested-page.component.html',
  imports: [
    CommonModule,
    NgOptimizedImage,
    DetailedProfileComponent,
    KundaliScoreComponent,
  ],
})
export class InterestedPageComponent {
  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);
  private kundaliService = inject(KundaliService);

  interestedProfiles = this.profileService.likedProfiles;
  private currentUser = this.profileService.currentUser;
  selectedProfile = signal<Profile | null>(null);

  // --- Kundali Match Scores ---
  kundaliScores = signal<Map<number, KundaliMatch>>(new Map());
  isLoadingScores = signal(true);

  // Since all profiles on this page are liked, this will always be true
  // when a profile is selected.
  isSelectedProfileLiked = computed(() => !!this.selectedProfile());

  constructor() {
    // Calculate Kundali scores when interested profiles or user change
    effect(async () => {
      this.isLoadingScores.set(true);
      const user = this.currentUser();
      const profilesToScore = this.interestedProfiles();
      
      const scorePromises = profilesToScore.map(p => 
          this.kundaliService.getMatchScore(user, p).then(score => ({ id: p.id, score }))
      );
      
      const scores = await Promise.all(scorePromises);
      
      this.kundaliScores.update(currentScores => {
          const newScores = new Map(currentScores);
          scores.forEach(item => {
              newScores.set(item.id, item.score);
          });
          return newScores;
      });
      this.isLoadingScores.set(false);
    }, { allowSignalWrites: true });
  }

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
