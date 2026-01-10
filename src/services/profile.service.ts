
import { Injectable, signal, computed, inject } from '@angular/core';
import { Profile } from '../models/profile.model';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/api`;

  private allProfiles = signal<Profile[]>([]);
  
  // Let's assume the first profile is our current user
  currentUser = signal<Profile>(this.allProfiles()[0]);
  
  // The rest are profiles to discover
  discoverableProfiles = computed(() => this.allProfiles().slice(1));

  likedProfiles = signal<Profile[]>([]);
  
  // --- Profile Sharing State ---
  private profilesSharedToday = signal<number>(0);
  private readonly MAX_SHARES_PER_DAY = 5;

  canShareProfile = computed(() => this.profilesSharedToday() < this.MAX_SHARES_PER_DAY);
  getSharesLeft = computed(() => this.MAX_SHARES_PER_DAY - this.profilesSharedToday());
  
  incrementShares(): void {
    if (this.canShareProfile()) {
      this.profilesSharedToday.update(count => count + 1);
    }
  }

  // --- User-facing Methods ---
  
  likeProfile(profile: Profile) {
    this.likedProfiles.update(profiles => {
      if (profiles.some(p => p.id === profile.id)) {
        return profiles;
      }
      return [profile, ...profiles];
    });
  }

  updateCurrentUser(updatedProfile: Profile) {
    this.currentUser.set(updatedProfile);
    this.saveProfile(updatedProfile);
  }

  // --- Admin Methods ---

  getAllProfiles() {
    return computed(() => this.allProfiles());
  }

  getProfileById(id: number): Profile | undefined {
    return this.allProfiles().find(p => p.id === id);
  }

  createProfile(profileData: Omit<Profile, 'id'>): void {
    this.allProfiles.update(profiles => {
      const newId = Math.max(...profiles.map(p => p.id), 0) + 1;
      const newProfile: Profile = { id: newId, ...profileData };
      return [...profiles, newProfile];
    });
  }

  updateProfileById(id: number, updatedProfileData: Omit<Profile, 'id'>): void {
    this.allProfiles.update(profiles => {
      const index = profiles.findIndex(p => p.id === id);
      if (index !== -1) {
        profiles[index] = { id, ...updatedProfileData };
        
        // If the updated profile is the current user, update that signal too
        if (this.currentUser().id === id) {
          this.currentUser.set(profiles[index]);
        }
      }
      return [...profiles];
    });
    
  }
  async saveProfile(profileData: Profile): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    return firstValueFrom(
      this.http.post<any>(`${this.apiUrl}/profile`, profileData, { headers })
    );
  }
  deleteProfile(id: number): void {
    this.allProfiles.update(profiles => profiles.filter(p => p.id !== id));
    this.likedProfiles.update(profiles => profiles.filter(p => p.id !== id));
  }
}
