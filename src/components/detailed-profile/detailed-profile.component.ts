
import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Profile } from '../../models/profile.model';

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

  currentImageIndex = signal(0);

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
}
