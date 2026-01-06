import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [CommonModule],
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  notification = this.notificationService.notification;
}
