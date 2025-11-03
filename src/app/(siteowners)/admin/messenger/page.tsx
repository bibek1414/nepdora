"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationList } from "@/components/site-owners/admin/messenger/conversation-list";
import { ChatWindow } from "@/components/site-owners/admin/messenger/chat-window";
import { MessageInput } from "@/components/site-owners/admin/messenger/message-input";
import { useFacebookApi } from "@/services/api/owner-sites/admin/facebook";
import {
  getConversations,
  sendMessage as sendFacebookMessage,
  formatTimestamp,
} from "@/lib/facebook";

// Updated interface to include profile_pic
interface FacebookMessageFromAPI {
  id: string;
  message: string;
  created_time: string;
  from: {
    id: string;
    name: string;
    profile_pic?: string; // Added this field
  };
}

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderProfilePic?: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  participantId: string;
}

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageId, setPageId] = useState<string>("");
  const [pageAccessToken, setPageAccessToken] = useState<string>("");
  const [isIntegrationReady, setIsIntegrationReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const loadIntegration = async () => {
      try {
        const integrations = await useFacebookApi.getFacebookIntegrations();

        if (integrations.length === 0) {
          setError(
            "No Facebook integration found. Please connect your Facebook page first."
          );
          setIsLoading(false);
          return;
        }

        const activeIntegration =
          integrations.find(i => i.is_enabled) || integrations[0];

        if (!activeIntegration) {
          setError("No active Facebook integration found.");
          setIsLoading(false);
          return;
        }

        setPageId(activeIntegration.page_id);
        setPageAccessToken(activeIntegration.page_access_token);
        setIsIntegrationReady(true);
      } catch (err) {
        console.error("Error loading Facebook integration:", err);
        setError("Failed to load Facebook integration. Please try again.");
        setIsLoading(false);
      }
    };

    loadIntegration();
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!isIntegrationReady || !pageId || !pageAccessToken) {
      return;
    }

    try {
      const fbConversations = await getConversations(pageId, pageAccessToken);

      const formattedConversations = fbConversations.map(conv => {
        const participant = conv.participants.data.find(p => p.id !== pageId);
        const lastMessage = conv.messages?.data[0];

        return {
          id: conv.id,
          name: participant?.name || "Unknown User",
          avatar: participant?.profile_pic,
          lastMessage: lastMessage?.message || "No messages",
          timestamp: formatTimestamp(
            lastMessage?.created_time || conv.updated_time
          ),
          unread: (conv.unread_count || 0) > 0,
          participantId: participant?.id || "",
        };
      });

      setConversations(formattedConversations);

      if (formattedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(formattedConversations[0].id);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(
        "Failed to load conversations. Please check your Facebook integration."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isIntegrationReady, pageId, pageAccessToken, selectedConversation]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !pageId || !pageAccessToken) return;

      try {
        const response = await fetch(
          `/api/facebook/conversations/${conversationId}/messages?pageAccessToken=${pageAccessToken}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        // Debug: Log the raw data
        console.log("Raw messages data:", data.messages);

        // Map the messages with the profile_pic field
        const formattedMessages = data.messages.map(
          (msg: FacebookMessageFromAPI) => {
            console.log("Processing message:", {
              id: msg.id,
              from: msg.from,
              profile_pic: msg.from.profile_pic,
            });

            return {
              id: msg.id,
              conversationId,
              sender: msg.from.id === pageId ? "You" : msg.from.name,
              content: msg.message,
              timestamp: formatTimestamp(msg.created_time),
              isOwn: msg.from.id === pageId,
              senderProfilePic: msg.from.profile_pic, // This now comes from the API
            };
          }
        );

        console.log("Formatted messages with profile pics:", formattedMessages);
        setMessages(formattedMessages.reverse());
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages. Please try again.");
      }
    },
    [pageId, pageAccessToken]
  );

  useEffect(() => {
    if (isIntegrationReady) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 30000);
      return () => clearInterval(interval);
    }
  }, [isIntegrationReady, fetchConversations]);

  useEffect(() => {
    if (selectedConversation && pageAccessToken) {
      fetchMessages(selectedConversation);

      const interval = setInterval(() => {
        fetchMessages(selectedConversation);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedConversation, pageAccessToken, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !pageAccessToken) return;

    const tempId = `temp-${Date.now()}`;

    try {
      const conversation = conversations.find(
        c => c.id === selectedConversation
      );
      if (!conversation) return;

      const newMessage: Message = {
        id: tempId,
        conversationId: selectedConversation,
        sender: "You",
        content,
        timestamp: new Date().toISOString(),
        isOwn: true,
      };

      setMessages(prev => [...prev, newMessage]);

      await sendFacebookMessage(
        conversation.participantId,
        content,
        pageAccessToken
      );

      await fetchMessages(selectedConversation);
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");

      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error && !isIntegrationReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="mb-4 text-red-500">{error}</p>
          <a
            href="/admin/settings/integrations"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Go to Integrations
          </a>
        </div>
      </div>
    );
  }

  const selectedConversationData = conversations.find(
    c => c.id === selectedConversation
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConversationList
        conversations={conversations}
        selectedId={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <ChatWindow
              messages={messages}
              conversationName={
                selectedConversationData?.name || "Conversation"
              }
              conversationAvatar={selectedConversationData?.avatar}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-5xl">💬</div>
              <p className="text-lg text-gray-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
