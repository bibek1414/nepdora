// lib/message-store.ts
interface MessageData {
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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments?: any[];
}

interface ConversationUpdate {
  conversationId: string;
  pageId: string;
  snippet: string;
  updated_time: string;
  sender_name: string;
  sender_id: string;
  message_type?: "text" | "image" | "video" | "audio" | "file" | string;
}
//eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (data: any) => void;

class MessageStore {
  private messages: Map<string, MessageData[]> = new Map();
  private conversations: Map<string, ConversationUpdate> = new Map();
  private listeners: Map<string, Set<Listener>> = new Map();

  on(event: string, listener: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
    console.log(
      `✅ Added listener for event: ${event}, total: ${this.listeners.get(event)!.size}`
    );
  }

  off(event: string, listener: Listener) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      console.log(
        `❌ Removed listener for event: ${event}, remaining: ${listeners.size}`
      );
    }
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, data: any) {
    const listeners = this.listeners.get(event);
    console.log(
      `🔔 Emitting event: ${event}, listeners: ${listeners?.size || 0}`
    );
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (err) {
          console.error(`Error in listener for ${event}:`, err);
        }
      });
    }
  }

  addMessage(message: MessageData) {
    const { conversationId } = message;

    if (!this.messages.has(conversationId)) {
      this.messages.set(conversationId, []);
    }

    const messages = this.messages.get(conversationId)!;

    // Avoid duplicates
    const exists = messages.some(m => m.id === message.id);
    if (!exists) {
      messages.push(message);
      console.log(
        `💾 Added message ${message.id} to store for conversation ${conversationId}`
      );

      // Emit message update event for this pageId
      this.emit("message_update", {
        pageId: message.pageId,
        message,
      });
    }
  }

  updateConversation(update: ConversationUpdate) {
    this.conversations.set(update.conversationId, update);
    console.log(`💬 Updated conversation ${update.conversationId}`);

    // Emit conversation update event for this pageId
    this.emit("conversation_update", {
      pageId: update.pageId,
      update,
    });
  }

  getMessages(conversationId: string): MessageData[] {
    return this.messages.get(conversationId) || [];
  }

  getConversation(conversationId: string): ConversationUpdate | undefined {
    return this.conversations.get(conversationId);
  }

  getStats() {
    return {
      totalMessages: Array.from(this.messages.values()).reduce(
        (sum, msgs) => sum + msgs.length,
        0
      ),
      totalConversations: this.conversations.size,
      activeListeners: Array.from(this.listeners.entries()).map(
        ([event, listeners]) => ({
          event,
          count: listeners.size,
        })
      ),
    };
  }
}

export const messageStore = new MessageStore();
