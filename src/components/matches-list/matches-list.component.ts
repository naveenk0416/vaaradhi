
import { Component, ChangeDetectionStrategy, input, output, inject, signal, effect } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Profile } from '../../models/profile.model';
import { KundaliService, KundaliMatch } from '../../services/kundali.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-matches-list',
  templateUrl: './matches-list.component.html',
  imports: [CommonModule, NgOptimizedImage],
})
export class MatchesListComponent {
  profiles = input.required<Profile[]>();
  profileSelected = output<Profile>();

  private kundaliService = inject(KundaliService);
  private profileService = inject(ProfileService);
  private currentUser = this.profileService.currentUser;

  kundaliScores = signal<Map<number, KundaliMatch>>(new Map());
  
  constructor() {
    effect(async () => {
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
    }, { allowSignalWrites: true });
  }
}
