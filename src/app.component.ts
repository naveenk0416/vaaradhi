
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from './services/profile.service';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';
import { NotificationComponent } from './components/notification/notification.component';
import { Profile } from './models/profile.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NotificationComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
})
export class AppComponent {
  profileService = inject(ProfileService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.profileService.currentUser;

}
