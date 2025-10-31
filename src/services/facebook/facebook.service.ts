import axios from "axios";

const FACEBOOK_API_VERSION = "v18.0";
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

interface FacebookConversation {
  id: string;
  updated_time: string;
  participants: {
    data: Array<{
      name: string;
      email?: string;
      id: string;
    }>;
  };
  messages: {
    data: Array<{
      id: string;
      created_time: string;
      from: {
        name: string;
        email?: string;
        id: string;
      };
      message: string;
      attachments?: {
        data: Array<{
          type: string;
          payload: {
            url?: string;
            sticker_id?: number;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            coordinates?: any;
          };
        }>;
      };
    }>;
    paging: {
      cursors: {
        before: string;
        after: string;
      };
      next?: string;
    };
  };
  unread_count?: number;
}

export const facebookService = {
  // Get Facebook page access token
  async getPageAccessToken(userAccessToken: string, pageId: string) {
    try {
      const response = await axios.get(`${FACEBOOK_GRAPH_URL}/me/accounts`, {
        params: {
          access_token: userAccessToken,
          fields: "id,name,access_token,tasks",
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      interface FacebookPage {
        id: string;
        access_token: string;
        name?: string;
        category?: string;
      }

      const page = response.data.data.find(
        (page: FacebookPage) => page.id === pageId
      );
      return page?.access_token || null;
    } catch (error) {
      console.error("Error getting page access token:", error);
      throw error;
    }
  },

  // Get business account ID
  async getBusinessAccount(accessToken: string) {
    try {
      const response = await axios.get(`${FACEBOOK_GRAPH_URL}/me/businesses`, {
        params: {
          access_token: accessToken,
          fields: "id,name,primary_page",
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      interface BusinessAccount {
        id: string;
        name: string;
        primary_page?: {
          id: string;
          name: string;
        };
      }

      return response.data.data?.[0] as BusinessAccount | undefined;
    } catch (error) {
      console.error("Error getting business account:", error);
      throw error;
    }
  },

  // FIXED: Get PAGE conversations (not business conversations)
  async getPageConversations(
    accessToken: string,
    pageId: string,
    limit = 10,
    after?: string
  ): Promise<{ conversations: FacebookConversation[]; next?: string }> {
    try {
      interface PageConversationsParams {
        access_token: string;
        fields: string;
        limit: number;
        after?: string;
      }

      const params: PageConversationsParams = {
        access_token: accessToken,
        fields:
          "participants,updated_time,unread_count,messages.limit(10){message,from,created_time,attachments}",
        limit,
      };

      if (after) {
        params.after = after;
      }

      // CHANGED: Use pageId instead of businessId
      const response = await axios.get<{
        data: FacebookConversation[];
        paging?: { next?: string };
      }>(`${FACEBOOK_GRAPH_URL}/${pageId}/conversations`, { params });

      return {
        conversations: response.data.data,
        next: response.data.paging?.next,
      };
    } catch (error) {
      console.error("Error getting page conversations:", error);
      throw error;
    }
  },

  // Alternative: Get conversations for a specific user/thread
  async getConversations(
    pageAccessToken: string,
    pageId: string
  ): Promise<{ data: FacebookConversation[]; paging?: { next?: string } }> {
    try {
      const response = await axios.get<{
        data: FacebookConversation[];
        paging?: { next?: string };
      }>(`${FACEBOOK_GRAPH_URL}/${pageId}/conversations`, {
        params: {
          access_token: pageAccessToken,
          fields:
            "id,participants,updated_time,unread_count,link,message_count",
          platform: "messenger", // Only get messenger conversations
        },
      });
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error fetching conversations:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get conversation by ID
  async getConversation(
    accessToken: string,
    conversationId: string
  ): Promise<FacebookConversation> {
    try {
      const response = await axios.get<FacebookConversation>(
        `${FACEBOOK_GRAPH_URL}/${conversationId}`,
        {
          params: {
            access_token: accessToken,
            fields:
              "id,participants,updated_time,unread_count,messages.limit(10){message,from,created_time}",
          },
        }
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error getting conversation:", error);
      throw error;
    }
  },

  /**
   * Send a message to a Facebook user
   * @param recipientId - The PSID of the message recipient
   * @param message - The message text to send
   * @param accessToken - Page access token with pages_messaging permission
   * @param messagingType - Type of message (RESPONSE, UPDATE, MESSAGE_TAG)
   * @param tag - Optional message tag for non-promotional messages
   * @returns Promise with the API response
   */
  async sendMessage(
    recipientId: string,
    message: string,
    accessToken: string,
    messagingType: "RESPONSE" | "UPDATE" | "MESSAGE_TAG" = "RESPONSE",
    tag?: string
  ) {
    try {
      const url = `${FACEBOOK_GRAPH_URL}/me/messages`;
      interface MessagePayload {
        messaging_type: "RESPONSE" | "UPDATE" | "MESSAGE_TAG";
        recipient: {
          id: string;
        };
        message: {
          text: string;
        };
        tag?: string;
      }

      const payload: MessagePayload = {
        messaging_type: messagingType,
        recipient: {
          id: recipientId,
        },
        message: {
          text: message,
        },
      };

      // Add message tag if provided (required for certain non-promotional use cases)
      if (tag) {
        payload.tag = tag;
      }

      const response = await axios.post(url, payload, {
        params: { access_token: accessToken },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Message sent successfully:", response.data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      throw new Error(
        `Failed to send message: ${error.response?.data?.error?.message || error.message}`
      );
    }
  },

  /**
   * Send a message with quick replies
   * @param recipientId - The PSID of the message recipient
   * @param message - The message text to send
   * @param quickReplies - Array of quick reply options
   * @param accessToken - Page access token
   */
  async sendQuickReplies(
    recipientId: string,
    message: string,
    quickReplies: Array<{ title: string; payload: string }>,
    accessToken: string
  ) {
    try {
      const url = `${FACEBOOK_GRAPH_URL}/me/messages`;

      const response = await axios.post(
        url,
        {
          messaging_type: "RESPONSE",
          recipient: { id: recipientId },
          message: {
            text: message,
            quick_replies: quickReplies.map(qr => ({
              content_type: "text",
              title: qr.title,
              payload: qr.payload,
            })),
          },
        },
        {
          params: { access_token: accessToken },
          headers: { "Content-Type": "application/json" },
        }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error sending quick replies:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  /**
   * Send a typing indicator
   * @param recipientId - The PSID of the message recipient
   * @param accessToken - Page access token
   */
  async sendTypingIndicator(recipientId: string, accessToken: string) {
    try {
      const url = `${FACEBOOK_GRAPH_URL}/me/messages`;

      await axios.post(
        url,
        {
          recipient: { id: recipientId },
          sender_action: "typing_on",
        },
        {
          params: { access_token: accessToken },
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error sending typing indicator:", error);
      // Don't throw error for typing indicators as they're not critical
    }
  },

  // Get user profile information
  async getUserProfile(userId: string, accessToken: string) {
    try {
      const response = await axios.get(`${FACEBOOK_GRAPH_URL}/${userId}`, {
        params: {
          access_token: accessToken,
          fields: "id,name,email,profile_pic,first_name,last_name",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },

  // Mark conversation as read
  async markAsRead(conversationId: string, accessToken: string) {
    try {
      const response = await axios.post(
        `${FACEBOOK_GRAPH_URL}/${conversationId}/read`,
        {},
        {
          params: {
            access_token: accessToken,
          },
        }
      );
      return response.data.success;
    } catch (error) {
      console.error("Error marking conversation as read:", error);
      throw error;
    }
  },

  // Get conversation messages with pagination
  async getConversationMessages(
    conversationId: string,
    accessToken: string,
    limit = 50,
    before?: string
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: Record<string, any> = {
        access_token: accessToken,
        limit,
        fields: "id,message,from,created_time,attachments",
      };

      if (before) {
        params.before = before;
      }

      const response = await axios.get(
        `${FACEBOOK_GRAPH_URL}/${conversationId}/messages`,
        { params }
      );

      return {
        messages: response.data.data,
        paging: response.data.paging,
      };
    } catch (error) {
      console.error("Error getting conversation messages:", error);
      throw error;
    }
  },

  // Get conversation participants
  async getConversationParticipants(
    conversationId: string,
    accessToken: string
  ) {
    try {
      const response = await axios.get(
        `${FACEBOOK_GRAPH_URL}/${conversationId}/participants`,
        {
          params: {
            access_token: accessToken,
            fields: "id,name,profile_pic",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error getting conversation participants:", error);
      throw error;
    }
  },

  // Get business page insights
  async getPageInsights(
    pageId: string,
    accessToken: string,
    metric: string,
    period: "day" | "week" | "month" = "day"
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await axios.get(
        `${FACEBOOK_GRAPH_URL}/${pageId}/insights/${metric}`,
        {
          params: {
            access_token: accessToken,
            period,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error getting page insights:", error);
      throw error;
    }
  },
};
