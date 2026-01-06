
import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-matches-list',
  templateUrl: './matches-list.component.html',
  imports: [CommonModule, NgOptimizedImage],
})
export class MatchesListComponent {
  profiles = input.required<Profile[]>();
  profileSelected = output<Profile>();
}
