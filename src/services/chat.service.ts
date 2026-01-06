
import { Injectable, signal, inject, effect } from '@angular/core';
import { Profile } from '../models/profile.model';
import { ChatMessage } from '../models/chat.model';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private profileService = inject(ProfileService);
  private conversations = signal<Map<number, ChatMessage[]>>(new Map());
  private currentUser = this.profileService.currentUser;

  typingContactId = signal<number | null>(null);

  initializeConversation(profileId: number): void {
    this.conversations.update(convos => {
      if (!convos.has(profileId)) {
        // Create a new conversation with a welcome message
        const initialMessage: ChatMessage = {
          senderId: profileId,
          text: `Hey! Thanks for matching. It's great to connect. How are you? 😊`,
          timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
        };
        convos.set(profileId, [initialMessage]);
      }
      return new Map(convos);
    });
  }

  getMessages(profileId: number): ChatMessage[] {
    return this.conversations().get(profileId) || [];
  }

  sendMessage(profileId: number, text: string): void {
    const newMessage: ChatMessage = {
      senderId: this.currentUser().id,
      text,
      timestamp: new Date()
    };

    this.conversations.update(convos => {
      const existingMessages = convos.get(profileId) || [];
      convos.set(profileId, [...existingMessages, newMessage]);
      return new Map(convos);
    });

    // Simulate a reply
    this.simulateReply(profileId);
  }

  private simulateReply(profileId: number): void {
    this.typingContactId.set(profileId);

    const replies = [
      "That's really interesting! Tell me more.",
      "Haha, that's funny!",
      "I completely agree.",
      "Oh wow, I never thought of it that way.",
      "So what do you do for fun?",
      "That sounds like a great plan.",
      "I'm doing well, thanks for asking! Just relaxing at home. What about you?",
      "I'd love to hear more about your travels.",
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const typingDuration = Math.random() * 1500 + 1000; // 1-2.5 seconds

    setTimeout(() => {
      const replyMessage: ChatMessage = {
        senderId: profileId,
        text: randomReply,
        timestamp: new Date()
      };
      this.conversations.update(convos => {
        const existingMessages = convos.get(profileId) || [];
        convos.set(profileId, [...existingMessages, replyMessage]);
        return new Map(convos);
      });
      this.typingContactId.set(null);
    }, typingDuration);
  }
}
