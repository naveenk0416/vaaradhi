
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kundali-score',
  templateUrl: './kundali-score.component.html',
  imports: [CommonModule],
})
export class KundaliScoreComponent {
  score = input.required<number>();
  summary = input.required<string>();
  size = input<'small' | 'large'>('large');

  circumference = 100;

  // Calculate the stroke-dasharray value for the progress circle
  dashArray = computed(() => {
    const scorePercentage = (this.score() / 36) * this.circumference;
    return `${scorePercentage}, ${this.circumference}`;
  });

  // Determine the color of the progress bar based on the summary
  colorClass = computed(() => {
    switch (this.summary().toLowerCase()) {
      case 'excellent':
        return 'text-teal-400';
      case 'good':
        return 'text-green-500';
      case 'average':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  });
}
