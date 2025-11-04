"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationList } from "@/components/site-owners/admin/messenger/conversation-list";
import { ChatWindow } from "@/components/site-owners/admin/messenger/chat-window";
import { MessageInput } from "@/components/site-owners/admin/messenger/message-input";
import { sendMessage as sendFacebookMessage } from "@/lib/facebook";

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

interface ConversationData {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unread: boolean;
  participantId?: string;
}

export default function MessagingPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [selectedConversationData, setSelectedConversationData] =
    useState<ConversationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: number;
    pageId: string;
    pageAccessToken: string;
    pageName: string;
  } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleIntegrationChange = useCallback(
    (
      integration: {
        id: number;
        pageId: string;
        pageAccessToken: string;
        pageName: string;
      } | null
    ) => {
      setSelectedIntegration(integration);
      // Clear selected conversation and messages when integration changes
      setSelectedConversation(null);
      setSelectedConversationData(null);
      setMessages([]);
      if (!integration) {
        setError(
          "No Facebook integration selected. Please select a page from the dropdown."
        );
      } else {
        setError(null);
      }
    },
    []
  );

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId || !selectedIntegration) return;

      try {
        const response = await fetch(
          `/api/facebook/conversations/${conversationId}/messages?pageAccessToken=${selectedIntegration.pageAccessToken}`
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
              sender:
                msg.from.id === selectedIntegration.pageId
                  ? "You"
                  : msg.from.name,
              content: msg.message,
              // Keep raw ISO so sorting works in ChatWindow
              timestamp: msg.created_time,
              isOwn: msg.from.id === selectedIntegration.pageId,
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
    [selectedIntegration]
  );

  // Real-time conversation list updates via page-level webhook stream
  useEffect(() => {
    if (!selectedIntegration) return;

    console.log("🔌 Setting up page-level conversation stream");
    const pageStream = new EventSource(
      `/api/facebook/conversations/page-stream?pageId=${selectedIntegration.pageId}`
    );

    pageStream.onopen = () => {
      console.log("✅ Page-level conversation stream connected");
    };

    pageStream.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "heartbeat" || data.type === "connected") {
          return;
        }

        if (data.type === "conversation_update" && data.data) {
          // ConversationList now manages its own state, so we don't need to update here
          // The ConversationList component will refetch when needed
          console.log(
            "📨 Conversation update received (handled by ConversationList)"
          );
        }
      } catch (e) {
        console.error("Error parsing page-level SSE message:", e);
      }
    };

    pageStream.onerror = err => {
      console.error("Page-level conversation SSE error (auto-retry):", err);
    };

    return () => {
      console.log("🔌 Closing page-level conversation stream");
      pageStream.close();
    };
  }, [selectedIntegration]);

  useEffect(() => {
    if (selectedConversation && selectedIntegration) {
      // Fetch initial messages
      fetchMessages(selectedConversation);

      // Set up SSE connection for real-time updates
      const streamUrl = `/api/facebook/conversations/stream?conversationId=${selectedConversation}&pageId=${selectedIntegration.pageId}`;
      const eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        console.log("SSE connected");
      };

      eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "heartbeat") {
            // keep-alive
            return;
          }

          if (data.type === "connected") {
            console.log("SSE connected event received");
            return;
          }

          if (
            (data.type === "new_message" || data.type === "existing_message") &&
            data.data
          ) {
            const webhookMessage = data.data;

            // Convert webhook message format to our Message format
            const newMessage: Message = {
              id: webhookMessage.id,
              conversationId: webhookMessage.conversationId,
              sender:
                webhookMessage.from.id === selectedIntegration.pageId
                  ? "You"
                  : webhookMessage.from.name,
              content: webhookMessage.message,
              timestamp: webhookMessage.created_time,
              isOwn: webhookMessage.from.id === selectedIntegration.pageId,
              senderProfilePic: webhookMessage.from.profile_pic,
            };

            // Add message if it doesn't already exist
            setMessages(prev => {
              const exists = prev.some(m => m.id === newMessage.id);
              if (exists) {
                return prev;
              }
              return [...prev, newMessage];
            });

            // ConversationList manages its own state, so we don't update it here
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      };

      eventSource.onerror = error => {
        console.error("SSE connection error (will auto-retry):", error);
        // Do not manually close; EventSource will auto-reconnect
      };

      return () => {
        eventSource.close();
      };
    }
  }, [selectedConversation, selectedIntegration, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !selectedIntegration) return;

    const tempId = `temp-${Date.now()}`;

    try {
      // Get participant ID from selected conversation data or extract from conversation ID
      let participantId: string | undefined =
        selectedConversationData?.participantId;

      if (!participantId) {
        // Fallback: Extract participant ID from conversation ID (format: t_<pageId>_<participantId>)
        const parts = selectedConversation.split("_");
        participantId = parts.length > 2 ? parts[2] : undefined;
      }

      if (!participantId) {
        throw new Error("Could not extract participant ID from conversation");
      }

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
        participantId,
        content,
        selectedIntegration.pageAccessToken
      );

      await fetchMessages(selectedConversation);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");

      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (error && !selectedIntegration) {
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

  const handleSelectConversation = (
    id: string,
    conversation?: ConversationData
  ) => {
    setSelectedConversation(id);
    setSelectedConversationData(conversation || null);
    setMessages([]); // Clear messages when switching conversations
  };

  // Get conversation name and avatar from selected conversation data or messages
  const conversationName =
    selectedConversationData?.name ||
    messages.find(m => !m.isOwn)?.sender ||
    "Conversation";
  const conversationAvatar =
    selectedConversationData?.avatar ||
    messages.find(m => !m.isOwn)?.senderProfilePic;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConversationList
        selectedId={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onIntegrationChange={handleIntegrationChange}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedConversation && selectedIntegration ? (
          <>
            <ChatWindow
              messages={messages}
              conversationName={conversationName}
              conversationAvatar={conversationAvatar}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={!selectedIntegration}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-5xl">💬</div>
              <p className="text-lg text-gray-500">
                {!selectedIntegration
                  ? "Please select a Facebook page from the dropdown"
                  : "Select a conversation to start messaging"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
