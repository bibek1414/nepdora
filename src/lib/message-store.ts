/**
 * In-memory message store for real-time messaging
 * This stores messages received via webhook for SSE streaming
 */

import { EventEmitter } from "events";

interface StoredMessage {
  id: string;
  conversationId: string;
  message: string;
  from: {
    id: string;
    name: string;
  };
  created_time: string;
  pageId: string;
  senderId?: string; // Store sender ID for mapping
}

class MessageStore extends EventEmitter {
  private messages: Map<string, StoredMessage[]> = new Map();
  // Map from sender+page combo to conversation ID for quick lookup
  private conversationMap: Map<string, string> = new Map();
  private readonly MAX_MESSAGES_PER_CONVERSATION = 1000;

  /**
   * Add a new message to the store
   */
  addMessage(message: StoredMessage): void {
    const { conversationId, senderId, pageId } = message;

    // Store mapping from sender+page to conversation ID if we have senderId
    if (senderId && pageId) {
      const mapKey = `${pageId}_${senderId}`;
      if (!this.conversationMap.has(mapKey)) {
        this.conversationMap.set(mapKey, conversationId);
      }
    }

    if (!this.messages.has(conversationId)) {
      this.messages.set(conversationId, []);
    }

    const conversationMessages = this.messages.get(conversationId)!;

    // Check if message already exists (avoid duplicates)
    const exists = conversationMessages.some(m => m.id === message.id);
    if (exists) {
      return;
    }

    conversationMessages.push(message);

    // Keep only the latest messages
    if (conversationMessages.length > this.MAX_MESSAGES_PER_CONVERSATION) {
      conversationMessages.shift();
    }

    // Emit event for SSE subscribers
    this.emit("newMessage", message);
  }

  /**
   * Get conversation ID for a sender and page
   */
  getConversationIdForSender(senderId: string, pageId: string): string | null {
    const mapKey = `${pageId}_${senderId}`;
    return this.conversationMap.get(mapKey) || null;
  }

  /**
   * Map messages from one conversation ID to another (for Facebook conversation ID mapping)
   */
  remapMessages(oldConversationId: string, newConversationId: string): void {
    if (oldConversationId === newConversationId) {
      return;
    }

    const oldMessages = this.messages.get(oldConversationId);
    if (!oldMessages) {
      return;
    }

    // Move messages to new conversation ID
    if (!this.messages.has(newConversationId)) {
      this.messages.set(newConversationId, []);
    }

    const newMessages = this.messages.get(newConversationId)!;

    // Add old messages that don't exist in new conversation
    for (const msg of oldMessages) {
      const exists = newMessages.some(m => m.id === msg.id);
      if (!exists) {
        newMessages.push({
          ...msg,
          conversationId: newConversationId,
        });
      }
    }

    // Remove old conversation if it's empty
    if (oldMessages.length === 0 || oldConversationId.startsWith("t_")) {
      this.messages.delete(oldConversationId);
    }
  }

  /**
   * Get messages for a conversation
   */
  getMessages(conversationId: string): StoredMessage[] {
    return this.messages.get(conversationId) || [];
  }

  /**
   * Get all conversation IDs for a page
   */
  getConversationsForPage(pageId: string): string[] {
    const conversations: string[] = [];

    for (const [conversationId, messages] of this.messages.entries()) {
      if (messages.length > 0 && messages[0].pageId === pageId) {
        conversations.push(conversationId);
      }
    }

    return conversations;
  }

  /**
   * Clear messages for a conversation
   */
  clearConversation(conversationId: string): void {
    this.messages.delete(conversationId);
  }

  /**
   * Get the latest message for a conversation
   */
  getLatestMessage(conversationId: string): StoredMessage | null {
    const messages = this.messages.get(conversationId);
    if (!messages || messages.length === 0) {
      return null;
    }
    return messages[messages.length - 1];
  }
}

// Singleton instance
export const messageStore = new MessageStore();
