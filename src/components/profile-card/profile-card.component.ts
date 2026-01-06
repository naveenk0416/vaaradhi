
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  imports: [CommonModule, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  profile = input.required<Profile>();
  isActive = input<boolean>(false);
  action = input<'like' | 'pass' | null>();
  showEditButton = input<boolean>(false);
  isLiked = input<boolean>(false);
  editProfile = output();

  currentImageIndex = signal(0);
  private touchStartX = 0;

  nextImage(event: Event): void {
    event.stopPropagation();
    this.currentImageIndex.update(i => (i + 1) % this.profile().imageUrls.length);
  }

  previousImage(event: Event): void {
    event.stopPropagation();
    this.currentImageIndex.update(i => (i - 1 + this.profile().imageUrls.length) % this.profile().imageUrls.length);
  }

  goToImage(event: Event, index: number): void {
    event.stopPropagation();
    this.currentImageIndex.set(index);
  }

  getTransform(): string {
    if (!this.isActive() || !this.action()) {
      return 'rotate(0deg) translateX(0px) scale(1)';
    }
    const direction = this.action() === 'like' ? 1 : -1;
    return `rotate(${direction * 20}deg) translateX(${direction * 200}px) scale(0.8)`;
  }

  getOpacity(): number {
    return this.isActive() && this.action() ? 0 : 1;
  }

  // --- Touch Gesture Handling for Image Swipe ---

  handleTouchStart(event: TouchEvent): void {
    // Stop propagation to prioritize image swiping over card actions (like/pass)
    event.stopPropagation();
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchEnd(event: TouchEvent): void {
    event.stopPropagation();
    
    const touchEndX = event.changedTouches[0].clientX;
    const diffX = touchEndX - this.touchStartX;
    const swipeThreshold = 50; // Minimum distance in pixels for a swipe

    // Check if it's a real swipe and there are multiple images to swipe through
    if (Math.abs(diffX) > swipeThreshold && this.profile().imageUrls.length > 1) {
      if (diffX > 0) {
        // Swiped right -> show previous image
        this.previousImage(event);
      } else {
        // Swiped left -> show next image
        this.nextImage(event);
      }
    }
    
    // Reset for the next touch
    this.touchStartX = 0;
  }
}
