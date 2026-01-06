
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../models/profile.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  imports: [CommonModule],
})
export class AdminDashboardComponent {
  private profileService = inject(ProfileService);

  allProfiles = this.profileService.getAllProfiles();

  totalProfiles = computed(() => this.allProfiles().length);
  nriProfiles = computed(() => this.allProfiles().filter(p => p.userCategory === 'NRI').length);
  indiaProfiles = computed(() => this.allProfiles().filter(p => p.userCategory === 'INDIA').length);

  recentProfiles = computed(() => this.allProfiles().slice(-5).reverse());
}
