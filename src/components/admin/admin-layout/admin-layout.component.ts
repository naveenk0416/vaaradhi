
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class AdminLayoutComponent {
  adminAuthService = inject(AdminAuthService);
}
