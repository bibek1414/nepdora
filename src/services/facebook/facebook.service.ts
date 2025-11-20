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

interface SendMessageResult {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
  isOutsideWindow?: boolean;
  needsApproval?: boolean;
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

  // Get PAGE conversations
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

  // Get conversations for a specific user/thread
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
          platform: "messenger",
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
   * Check if a conversation is outside the 24-hour messaging window
   */
  async isOutside24HourWindow(
    conversationId: string,
    accessToken: string
  ): Promise<boolean> {
    try {
      const response = await axios.get(
        `${FACEBOOK_GRAPH_URL}/${conversationId}/messages`,
        {
          params: {
            access_token: accessToken,
            limit: 1,
            fields: "created_time,from",
          },
        }
      );

      if (!response.data.data || response.data.data.length === 0) {
        console.log("No messages found, assuming within window");
        return false;
      }

      const lastMessage = response.data.data[0];
      const lastMessageTime = new Date(lastMessage.created_time);
      const now = new Date();

      const hoursDiff =
        (now.getTime() - lastMessageTime.getTime()) / (1000 * 60 * 60);

      console.log(`Last message was ${hoursDiff.toFixed(2)} hours ago`);

      return hoursDiff > 24;
    } catch (error) {
      console.error("Error checking 24-hour window:", error);
      return false;
    }
  },

  /**
   * Send a message with automatic 24-hour window detection and graceful error handling
   */
  async sendMessageSmart(
    recipientId: string,
    message: string,
    accessToken: string,
    conversationId: string
  ): Promise<SendMessageResult> {
    try {
      // Check if we're outside the 24-hour window
      const needsTag = await this.isOutside24HourWindow(
        conversationId,
        accessToken
      );

      if (needsTag) {
        console.log(
          "🏷️ Outside 24-hour window, attempting with HUMAN_AGENT tag"
        );

        try {
          // Try sending with HUMAN_AGENT tag
          const result = await this.sendMessage(
            recipientId,
            message,
            accessToken,
            "MESSAGE_TAG",
            "HUMAN_AGENT"
          );

          return {
            success: true,
            data: result,
            isOutsideWindow: true,
            needsApproval: false,
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (tagError: any) {
          // Check if error is due to unapproved tag
          if (
            tagError.message.includes("outside the allowed window") ||
            tagError.message.includes("2018278")
          ) {
            console.error("❌ HUMAN_AGENT tag not approved yet!");

            return {
              success: false,
              error:
                "Message is outside 24-hour window and HUMAN_AGENT tag is not approved. Please request tag approval in Facebook App Settings.",
              isOutsideWindow: true,
              needsApproval: true,
            };
          }
          throw tagError;
        }
      } else {
        console.log("✅ Within 24-hour window, using standard RESPONSE");
        const result = await this.sendMessage(
          recipientId,
          message,
          accessToken,
          "RESPONSE"
        );

        return {
          success: true,
          data: result,
          isOutsideWindow: false,
          needsApproval: false,
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "Error in sendMessageSmart:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error: error.message,
        isOutsideWindow: false,
        needsApproval: false,
      };
    }
  },

  /**
   * Send a message to a Facebook user
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
   * Send a proactive follow-up within 24 hours to reset the window
   */
  async sendProactiveFollowUp(recipientId: string, accessToken: string) {
    try {
      const followUpMessage =
        "Thank you for your message! Our support team has received your inquiry and will respond soon. " +
        "Is there anything else we can help you with?";

      return await this.sendMessage(
        recipientId,
        followUpMessage,
        accessToken,
        "RESPONSE"
      );
    } catch (error) {
      console.error("Error sending proactive follow-up:", error);
      throw error;
    }
  },

  /**
   * Send a message with quick replies
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
