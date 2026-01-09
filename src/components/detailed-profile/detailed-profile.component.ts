
import { Component, ChangeDetectionStrategy, input, output, signal, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-detailed-profile',
  templateUrl: './detailed-profile.component.html',
  imports: [CommonModule, NgOptimizedImage],
})
export class DetailedProfileComponent {
  profile = input.required<Profile>();
  isLiked = input<boolean>(false);
  close = output<void>();
  interestSent = output<Profile>();

  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);

  currentImageIndex = signal(0);

  canShare = this.profileService.canShareProfile;
  sharesLeft = this.profileService.getSharesLeft;

  nextImage(): void {
    this.currentImageIndex.update(i => (i + 1) % this.profile().imageUrls.length);
  }

  previousImage(): void {
    this.currentImageIndex.update(i => (i - 1 + this.profile().imageUrls.length) % this.profile().imageUrls.length);
  }

  goToImage(index: number): void {
    this.currentImageIndex.set(index);
  }

  onExpressInterest(): void {
    this.interestSent.emit(this.profile());
  }

  shareProfileOnWhatsApp(): void {
    if (!this.canShare()) {
      this.notificationService.show('Share Limit Reached', 'You have already shared 5 profiles today.');
      return;
    }

    const p = this.profile();
    const message = `Check out this profile on Vaaradhi Matrimony:\n\n` +
                    `*Name:* ${p.name}, ${p.age}\n` +
                    `*Location:* ${p.city}, ${p.country}\n` +
                    `*Career:* ${p.career}\n` +
                    `*Bio:* ${p.bio.substring(0, 100)}...\n\n` +
                    `Find your match on Vaaradhi!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    this.profileService.incrementShares();
    this.notificationService.show('Profile Shared', `${p.name}'s profile has been shared.`);
  }
}
