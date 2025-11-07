import {
  WebhookNewMessageEvent,
  SendMessageRequest,
} from "@/types/owner-site/admin/conversations";
import { getApiBaseUrl } from "@/config/site";

// Use the vapebox subdomain for all API calls
const API_BASE_URL = getApiBaseUrl();

// 👇 Helper to handle responses
async function handleResponse(res: Response) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API request failed");
  }
  return res.json();
}

export const useConversationsApi = {
  /**
   * 📨 Get all conversations for a given pageId
   */
  async getConversations(pageId: string) {
    const res = await fetch(`${API_BASE_URL}/api/conversations/${pageId}`);
    return handleResponse(res);
  },

  /**
   * 💬 Get messages for a specific conversation
   */
  async getConversationMessages(conversationId: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/conversation-messages/${conversationId}`
    );
    return handleResponse(res);
  },

  /**
   * 🚀 Send a message to a user (used by useSendMessage)
   */
  async sendMessage(data: SendMessageRequest & { conversationId: string }) {
    const res = await fetch(`${API_BASE_URL}/api/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  /**
   * 🔄 Subscribe to conversation messages (real-time updates)
   * Simulates a webhook or websocket listener.
   * In production, replace this with WebSocket, Pusher, or Facebook webhook updates.
   */
  subscribeToConversation(
    conversationId: string,
    callback: (data: WebhookNewMessageEvent["data"]) => void
  ) {
    // You can replace this polling with a real-time solution later
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/conversation-messages/${conversationId}`
        );
        if (!res.ok) return;
        const data = await res.json();

        // Only call callback if there's a new message
        if (data && data.message) callback(data);
      } catch (err) {
        console.error("Subscription error:", err);
      }
    }, 5000); // poll every 5 seconds

    return () => clearInterval(interval);
  },
};
