
import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, viewChild, ElementRef, afterNextRender } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { startWith } from 'rxjs/operators';
import { ProfileService } from '../../services/profile.service';
import { ChatService } from '../../services/chat.service';
import { Profile } from '../../models/profile.model';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage, DatePipe],
})
export class ChatPageComponent {
  private profileService = inject(ProfileService);
  private chatService = inject(ChatService);
  
  // Signals
  private conversations = this.profileService.likedProfiles;
  currentUser = this.profileService.currentUser;
  selectedConversation = signal<Profile | null>(null);
  messages = signal<ChatMessage[]>([]);
  
  // New signals for UI state
  typingContactId = this.chatService.typingContactId;
  unreadConversations = signal<Set<number>>(new Set());

  // Form for new message and search
  newMessage = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(1)] });
  searchControl = new FormControl('', { nonNullable: true });

  // Filtered conversations based on search
  filteredConversations = computed(() => {
    const searchTerm = this.searchQuery();
    const allConvos = this.conversations();
    if (!searchTerm) {
      return allConvos;
    }
    return allConvos.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  private searchQuery = signal('');

  // For mobile view
  showMessagesViewOnMobile = signal(false);

  // For auto-scrolling
  messageContainer = viewChild<ElementRef<HTMLDivElement>>('messageContainer');

  constructor() {
    // Update search query signal when search control changes
    this.searchControl.valueChanges.pipe(
      startWith('')
    ).subscribe(value => {
      this.searchQuery.set(value);
    });

    // When messages update, scroll to the bottom
    effect(() => {
      const container = this.messageContainer();
      if (container) {
        // Use a timeout to ensure the DOM has been updated before scrolling
        setTimeout(() => {
          container.nativeElement.scrollTop = container.nativeElement.scrollHeight;
        }, 0);
      }
    });

    // Select the first conversation by default on desktop & simulate unread messages
    afterNextRender(() => {
       // Simulate some unread messages on load for demo purposes
       if (this.conversations().length > 1) {
         this.unreadConversations.update(unread => {
           unread.add(this.conversations()[1].id);
           return new Set(unread);
         });
       }
       if (window.innerWidth >= 768 && this.conversations().length > 0) {
        this.selectConversation(this.conversations()[0]);
      }
    });
  }

  selectConversation(profile: Profile): void {
    this.selectedConversation.set(profile);
    this.messages.set(this.chatService.getMessages(profile.id));
    this.showMessagesViewOnMobile.set(true);

    // Mark conversation as read
    this.unreadConversations.update(unread => {
      unread.delete(profile.id);
      return new Set(unread);
    });
  }

  sendMessage(): void {
    if (this.newMessage.invalid) return;
    
    const selectedProfile = this.selectedConversation();
    if (selectedProfile) {
      this.chatService.sendMessage(selectedProfile.id, this.newMessage.value);
      this.messages.set(this.chatService.getMessages(selectedProfile.id));
      this.newMessage.reset();
    }
  }

  backToConversations(): void {
    this.showMessagesViewOnMobile.set(false);
    this.selectedConversation.set(null);
  }

  getLastMessage(profileId: number): string {
    const conversationMessages = this.chatService.getMessages(profileId);
    if (conversationMessages.length === 0) {
      return 'No messages yet.';
    }
    return conversationMessages[conversationMessages.length - 1].text;
  }
}
