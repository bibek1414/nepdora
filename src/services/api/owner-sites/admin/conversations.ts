import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";
import {
  ConversationListItem,
  ConversationDetailResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/owner-site/admin/conversations";

export const useConversationsApi = {
  getConversations: async (pageId: string): Promise<ConversationListItem[]> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/conversations/${pageId}/`,
      {
        method: "GET",
        headers: createHeaders(),
        cache: "no-store",
      }
    );
    await handleApiError(response);
    return await response.json();
  },

  getConversationMessages: async (
    conversationId: string
  ): Promise<ConversationDetailResponse> => {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(
      `${API_BASE_URL}/api/conversation-messages/${conversationId}/`,
      {
        method: "GET",
        headers: createHeaders(),
        cache: "no-store",
      }
    );
    await handleApiError(response);
    return await response.json();
  },

  // FIXED: Always use recipient ID, never thread_id
  sendMessage: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    const { recipient_id, message, page_access_token } = data;

    // Always use the /me/messages endpoint with recipient ID
    const endpoint = `https://graph.facebook.com/v21.0/me/messages`;

    const body = {
      recipient: { id: recipient_id },
      message: { text: message },
    };

    const response = await fetch(
      `${endpoint}?access_token=${page_access_token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to send message");
    }

    const result = await response.json();
    return {
      message_id: result.message_id,
      recipient_id: result.recipient_id || recipient_id,
    };
  },
};
