import { Injectable, signal } from '@angular/core';

export interface Notification {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification = signal<Notification | null>(null);
  private timer: any;

  show(title: string, message: string): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.notification.set({ title, message });
    this.timer = setTimeout(() => this.hide(), 5000);
  }

  hide(): void {
    this.notification.set(null);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
