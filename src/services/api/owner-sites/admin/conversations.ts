import { apiFetch } from "@/lib/api-client";
import {
  WebhookNewMessageEvent,
  SendMessageRequest,
} from "@/types/owner-site/admin/conversations";
import { getApiBaseUrl } from "@/config/site";
import { createHeaders } from "@/utils/headers";
import { handleApiError } from "@/utils/api-error";

// Use the vapebox subdomain for all API calls
const API_BASE_URL = getApiBaseUrl();

export const useConversationsApi = {
  /**
   * 📨 Get all conversations for a given pageId
   */
  async getConversations(pageId: string) {
    const res = await apiFetch(`${API_BASE_URL}/api/conversations/${pageId}`, {
      headers: createHeaders(),
    });
    await handleApiError(res);
    return res.json();
  },

  /**
   * 💬 Get messages for a specific conversation
   */
  async getConversationMessages(conversationId: string) {
    const res = await apiFetch(
      `${API_BASE_URL}/api/conversation-messages/${conversationId}`,
      {
        headers: createHeaders(),
      }
    );
    await handleApiError(res);
    return res.json();
  },

  /**
   * Fetches the Facebook page access token from your backend.
   * Supports multiple integrations and optional filtering by pageId.
   */
  async getPageAccessToken(pageId?: string): Promise<string> {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/facebook`, {
        headers: createHeaders(),
      });

      await handleApiError(response);
      const data = await response.json();

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
    const { conversationId, message, pageId, fileUpload, attachment } = data;

    if (!conversationId) throw new Error("Conversation ID is required");
    if (!message && !fileUpload && !attachment)
      throw new Error("Message content or attachment is required");

    // Get correct page token
    const pageAccessToken = await this.getPageAccessToken(pageId);

    if (!pageAccessToken)
      throw new Error("Failed to retrieve page access token");

    // Use the recipient_id from the request data
    const recipientId = data.recipient_id;

    if (!recipientId) {
      throw new Error("Recipient ID is required to send a message");
    }

    // If there's a file upload, we need to upload it first
    if (fileUpload) {
      const formData = new FormData();
      formData.append("recipient", JSON.stringify({ id: recipientId }));

      // Determine attachment type based on file type
      let attachmentType = "file";
      const fileType = (fileUpload as Blob).type;
      if (fileType.startsWith("image/")) attachmentType = "image";
      else if (fileType.startsWith("audio/")) attachmentType = "audio";
      else if (fileType.startsWith("video/")) attachmentType = "video";

      formData.append(
        "message",
        JSON.stringify({
          attachment: {
            type: attachmentType,
            payload: {
              is_reusable: true,
            },
          },
        })
      );

      formData.append("filedata", fileUpload);

      const response = await apiFetch(
        `https://graph.facebook.com/v17.0/me/messages?access_token=${encodeURIComponent(
          pageAccessToken
        )}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Facebook send attachment error:", result);
        throw new Error(result.error?.message || "Failed to send attachment");
      }

      console.log("✅ Attachment sent successfully:", result);
      return result;
    }

    // Send text message or attachment with URL to Facebook Graph API
    const messagePayload: {
      recipient: { id: string };
      message: { text?: string; attachment?: typeof attachment };
      messaging_type: string;
      tag?: string;
    } = {
      recipient: { id: recipientId },
      message: {},
      messaging_type: data.tag ? "MESSAGE_TAG" : "RESPONSE",
    };

    if (data.tag) {
      messagePayload.tag = data.tag;
    }

    if (message) {
      messagePayload.message.text = message;
    }

    if (attachment) {
      messagePayload.message.attachment = attachment;
    }

    const response = await apiFetch(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${encodeURIComponent(
        pageAccessToken
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messagePayload),
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
};
