// lib/message-store.ts
export interface StoredMessage {
  id: string;
  conversationId: string;
  message: string;
  from: {
    id: string;
    name: string;
    profile_pic?: string;
  };
  created_time: string;
  pageId: string;
  senderId: string;
}

// Simple event emitter implementation
class EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  private events: Map<string, Function[]> = new Map();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on(event: string, listener: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  removeListener(event: string, listener: Function) {
    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...args: any[]) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  removeAllListeners(event?: string) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

class MessageStore extends EventEmitter {
  private messages: Map<string, StoredMessage> = new Map();
  private conversationMessages: Map<string, string[]> = new Map(); // conversationId -> messageIds
  private pageMessages: Map<string, string[]> = new Map(); // pageId -> messageIds

  addMessage(message: StoredMessage) {
    console.log(
      `💾 Adding message to store: ${message.id} for conversation: ${message.conversationId}`
    );

    // Store the message
    this.messages.set(message.id, message);

    // Add to conversation index
    if (!this.conversationMessages.has(message.conversationId)) {
      this.conversationMessages.set(message.conversationId, []);
    }
    const conversation = this.conversationMessages.get(message.conversationId)!;
    if (!conversation.includes(message.id)) {
      conversation.push(message.id);
    }

    // Add to page index
    if (!this.pageMessages.has(message.pageId)) {
      this.pageMessages.set(message.pageId, []);
    }
    const page = this.pageMessages.get(message.pageId)!;
    if (!page.includes(message.id)) {
      page.push(message.id);
    }

    console.log(
      `📊 Store stats - Total messages: ${this.messages.size}, Conversations: ${this.conversationMessages.size}`
    );

    // Emit event for real-time subscribers
    this.emit("newMessage", message);
  }

  getMessages(conversationId: string): StoredMessage[] {
    const messageIds = this.conversationMessages.get(conversationId) || [];
    const messages = messageIds
      .map(id => this.messages.get(id))
      .filter((msg): msg is StoredMessage => msg !== undefined)
      .sort(
        (a, b) =>
          new Date(a.created_time).getTime() -
          new Date(b.created_time).getTime()
      );

    console.log(
      `🔍 Retrieved ${messages.length} messages for conversation ${conversationId}`
    );
    return messages;
  }

  getMessagesByPage(pageId: string): StoredMessage[] {
    const messageIds = this.pageMessages.get(pageId) || [];
    const messages = messageIds
      .map(id => this.messages.get(id))
      .filter((msg): msg is StoredMessage => msg !== undefined)
      .sort(
        (a, b) =>
          new Date(a.created_time).getTime() -
          new Date(b.created_time).getTime()
      );

    console.log(`🔍 Retrieved ${messages.length} messages for page ${pageId}`);
    return messages;
  }

  getLatestMessage(conversationId: string): StoredMessage | null {
    const messages = this.getMessages(conversationId);
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }

  getAllMessages(): StoredMessage[] {
    return Array.from(this.messages.values()).sort(
      (a, b) =>
        new Date(a.created_time).getTime() - new Date(b.created_time).getTime()
    );
  }

  clear() {
    console.log("🧹 Clearing message store");
    this.messages.clear();
    this.conversationMessages.clear();
    this.pageMessages.clear();
    this.removeAllListeners();
  }

  getStats() {
    return {
      totalMessages: this.messages.size,
      totalConversations: this.conversationMessages.size,
      totalPages: this.pageMessages.size,
      conversations: Array.from(this.conversationMessages.entries()).map(
        ([id, messages]) => ({
          conversationId: id,
          messageCount: messages.length,
        })
      ),
    };
  }
}

export const messageStore = new MessageStore();
