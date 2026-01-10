
import { Component, ChangeDetectionStrategy, signal, inject, computed, viewChild, ElementRef, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';
import { NotificationService } from '../../services/notification.service';
import { KundaliService, KundaliMatch } from '../../services/kundali.service';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { DetailedProfileComponent } from '../detailed-profile/detailed-profile.component';
import { KundaliScoreComponent } from '../kundali-score/kundali-score.component';

interface Banner {
  imageUrl: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  imports: [CommonModule, ProfileCardComponent, DetailedProfileComponent, KundaliScoreComponent, RouterLink],
})
export class DiscoverPageComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private notificationService = inject(NotificationService);
  private kundaliService = inject(KundaliService);

  private profiles = this.profileService.discoverableProfiles;
  private currentUser = this.profileService.currentUser;
  currentIndex = signal(0);
  action = signal<'like' | 'pass' | null>(null);
  selectedProfile = signal<Profile | null>(null);

  // --- Kundali Match Scores ---
  kundaliScores = signal<Map<number, KundaliMatch>>(new Map());
  isLoadingScores = signal(true);

  // --- Banner Carousel State ---
  banners = signal<Banner[]>([
    {
      imageUrl: 'https://picsum.photos/seed/bannerA/1200/400',
      title: 'Begin Your Journey Together',
      subtitle: 'Find your perfect match from thousands of verified NRI profiles.'
    },
    {
      imageUrl: 'https://picsum.photos/seed/bannerB/1200/400',
      title: 'A New Chapter Awaits',
      subtitle: 'Discover meaningful connections with people who share your values.'
    },
    {
      imageUrl: 'https://picsum.photos/seed/bannerC/1200/400',
      title: 'Love Knows No Borders',
      subtitle: 'Connecting hearts from across the globe, right to your screen.'
    }
  ]);
  currentBannerIndex = signal(0);
  private autoplayInterval: any;

  // --- Profile Lists ---
  featuredProfiles = computed(() => this.profiles().filter(p => p.userCategory === 'NRI'));
  profilesFromIndia = computed(() => this.profiles().filter(p => p.userCategory === 'INDIA'));
  
  isSelectedProfileLiked = computed(() => {
    const selected = this.selectedProfile();
    if (!selected) return false;
    return this.profileService.likedProfiles().some(p => p.id === selected.id);
  });

  visibleProfiles = computed(() => {
    return this.featuredProfiles().slice(this.currentIndex(), this.currentIndex() + 3).reverse();
  });

  // --- Horizontal Carousel States ---
  indiaProfilesContainer = viewChild<ElementRef<HTMLUListElement>>('indiaProfilesContainer');
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  featuredProfilesContainer = viewChild<ElementRef<HTMLUListElement>>('featuredProfilesContainer');
  canScrollFeaturedLeft = signal(false);
  canScrollFeaturedRight = signal(false);
  
  constructor() {
    effect(() => {
      // Re-run this effect when profiles change to update scroll button visibility.
      this.profilesFromIndia();
      this.featuredProfiles();

      const indiaContainer = this.indiaProfilesContainer()?.nativeElement;
      if (indiaContainer) {
          setTimeout(() => this.checkScrollButtons(), 100);
      }
      
      const featuredContainer = this.featuredProfilesContainer()?.nativeElement;
      if (featuredContainer) {
          setTimeout(() => this.checkFeaturedScrollButtons(), 100);
      }
    });

    // Calculate Kundali scores when profiles or user change
    effect(async () => {
      this.isLoadingScores.set(true);
      const user = this.currentUser();
      const profilesToScore = this.profiles();
      
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

  ngOnInit(): void {
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // --- Banner Carousel Methods ---
  nextBanner(): void {
    this.currentBannerIndex.update(i => (i + 1) % this.banners().length);
    this.resetAutoplay();
  }

  previousBanner(): void {
    this.currentBannerIndex.update(i => (i - 1 + this.banners().length) % this.banners().length);
    this.resetAutoplay();
  }

  goToBanner(index: number): void {
    this.currentBannerIndex.set(index);
    this.resetAutoplay();
  }

  private startAutoplay(): void {
    this.autoplayInterval = setInterval(() => {
      this.currentBannerIndex.update(i => (i + 1) % this.banners().length);
    }, 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  private resetAutoplay(): void {
    this.stopAutoplay();
    this.startAutoplay();
  }

  // --- Profile Swiper Methods ---
  onAction(type: 'like' | 'pass') {
    if (this.currentIndex() >= this.featuredProfiles().length) return;

    if (type === 'like') {
      const likedProfile = this.featuredProfiles()[this.currentIndex()];
      if (likedProfile) {
        this.profileService.likeProfile(likedProfile);
        this.notificationService.show('New Match!', `${likedProfile.name} has been added to your matches.`);
      }
    }

    this.action.set(type);
    setTimeout(() => {
      this.currentIndex.update(i => i + 1);
      setTimeout(() => this.action.set(null), 100); 
    }, 700); 
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

  // --- Horizontal Carousel Methods ---
  scrollIndiaProfiles(direction: 'left' | 'right') {
    const container = this.indiaProfilesContainer()?.nativeElement;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
  }

  checkScrollButtons() {
    const container = this.indiaProfilesContainer()?.nativeElement;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const tolerance = 2;
    this.canScrollLeft.set(scrollLeft > tolerance);
    this.canScrollRight.set(scrollLeft < scrollWidth - clientWidth - tolerance);
  }

  scrollFeaturedProfiles(direction: 'left' | 'right') {
    const container = this.featuredProfilesContainer()?.nativeElement;
    if (!container) return;
    
    const scrollAmount = container.clientWidth * 0.9;
    
    container.scrollBy({ 
      left: direction === 'left' ? -scrollAmount : scrollAmount, 
      behavior: 'smooth' 
    });
  }

  checkFeaturedScrollButtons() {
    const container = this.featuredProfilesContainer()?.nativeElement;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const tolerance = 2;
    this.canScrollFeaturedLeft.set(scrollLeft > tolerance);
    this.canScrollFeaturedRight.set(scrollLeft < scrollWidth - clientWidth - tolerance);
  }
}
