import {
  WebhookNewMessageEvent,
  SendMessageRequest,
} from "@/types/owner-site/admin/conversations";
import { getApiBaseUrl } from "@/config/site";

// Use the vapebox subdomain for all API calls
const API_BASE_URL = getApiBaseUrl();
/**
 * Handles API responses robustly
 */
async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorMessage = `API request failed: ${res.status} ${res.statusText}`;

    try {
      // Try parsing JSON error
      const err = await res.json();
      if (err?.message) errorMessage = err.message;
    } catch {
      // Fallback to text
      const text = await res.text().catch(() => "");
      if (text) errorMessage = text;
    }

    // Include the URL for easier debugging
    errorMessage += ` (URL: ${res.url})`;

    throw new Error(errorMessage);
  }

  try {
    // Return JSON if available, otherwise null
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
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
   * Fetches the Facebook page access token from the backend
   */
  /**
   * Fetches the Facebook page access token from your backend.
   * Supports multiple integrations and optional filtering by pageId.
   */
  async getPageAccessToken(pageId?: string): Promise<string> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/facebook` // ✅ use your backend API base
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch page access token");
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("No Facebook integrations found");
      }

      // ✅ If a specific pageId is provided, find that integration
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let integration = data.find((item: any) => item.page_id === pageId);

      // ✅ Fallback to the first enabled integration
      if (!integration) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        integration = data.find((item: any) => item.is_enabled) || data[0];
      }

      const token = integration?.page_access_token;

      if (!token) {
        throw new Error(
          `No page access token found for page ${pageId || integration?.page_name}`
        );
      }

      return token;
    } catch (error) {
      console.error("Error fetching page access token:", error);
      throw new Error("Failed to retrieve Facebook page access token");
    }
  },

  async sendMessage(
    data: SendMessageRequest & { conversationId: string; pageId?: string }
  ) {
    const { conversationId, message, pageId } = data;

    if (!conversationId) throw new Error("Conversation ID is required");
    if (!message) throw new Error("Message content is required");

    // Get correct page token
    const pageAccessToken = await this.getPageAccessToken(pageId);

    if (!pageAccessToken)
      throw new Error("Failed to retrieve page access token");

    // Use the recipient_id from the request data
    const recipientId = data.recipient_id;

    if (!recipientId) {
      throw new Error("Recipient ID is required to send a message");
    }

    // Send message to Facebook Graph API
    const response = await fetch(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${encodeURIComponent(
        pageAccessToken
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
          messaging_type: "RESPONSE",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Facebook send message error:", result);
      throw new Error(result.error?.message || "Failed to send message");
    }

    console.log("✅ Message sent successfully:", result);
    return result;
  },

  subscribeToConversation(
    conversationId: string,
    callback: (message: any) => void
  ) {
    if (!conversationId) return () => {};

    const eventSource = new EventSource(
      `${API_BASE_URL}/api/conversation-messages/${conversationId}`
    );

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    };

    eventSource.onerror = err => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  },
};
