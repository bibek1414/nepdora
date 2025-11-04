"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationList } from "@/components/site-owners/admin/messenger/conversation-list";
import { ChatWindow } from "@/components/site-owners/admin/messenger/chat-window";
import { MessageInput } from "@/components/site-owners/admin/messenger/message-input";
import { useFacebookApi } from "@/services/api/owner-sites/admin/facebook";
import {
  getConversations,
  sendMessage as sendFacebookMessage,
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
        // Store raw ISO timestamp for sorting (most recent first)
        const rawTimestamp = lastMessage?.created_time || conv.updated_time;

        return {
          id: conv.id,
          name: participant?.name || "Unknown User",
          avatar: participant?.profile_pic,
          lastMessage: lastMessage?.message || "No messages",
          timestamp: rawTimestamp, // Store raw ISO timestamp for sorting
          unread: (conv.unread_count || 0) > 0,
          participantId: participant?.id || "",
        };
      });

      setConversations(prev => {
        // Only update if we have new conversations or if list is empty
        if (prev.length === 0 || formattedConversations.length > 0) {
          return formattedConversations;
        }
        return prev;
      });

      // Only set selected conversation if none is selected
      setSelectedConversation(current => {
        if (!current && formattedConversations.length > 0) {
          return formattedConversations[0].id;
        }
        return current;
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(
        "Failed to load conversations. Please check your Facebook integration."
      );
    } finally {
      setIsLoading(false);
    }
  }, [isIntegrationReady, pageId, pageAccessToken]);

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
              // Keep raw ISO so sorting works in ChatWindow
              timestamp: msg.created_time,
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
    if (isIntegrationReady && pageId) {
      fetchConversations();
    }
  }, [isIntegrationReady, pageId, pageAccessToken]);

  // Real-time conversation list updates via page-level webhook stream
  useEffect(() => {
    if (!isIntegrationReady || !pageId) return;

    console.log("🔌 Setting up page-level conversation stream");
    const pageStream = new EventSource(
      `/api/facebook/conversations/page-stream?pageId=${pageId}`
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
          const update = data.data as {
            conversationId: string;
            pageId: string;
            lastMessage: string;
            created_time: string;
            from: { id: string; name: string; profile_pic?: string };
            senderId: string;
          };

          console.log(
            "📨 Conversation update received:",
            update.conversationId
          );

          // Update conversation list - timestamp update will move to top via sorting
          setConversations(prev => {
            // Try to find conversation by exact ID or by matching participant ID
            const existing = prev.find(
              c =>
                c.id === update.conversationId ||
                c.participantId === update.senderId
            );

            if (existing) {
              // Update existing conversation - sorting will handle moving to top
              return prev.map(conv => {
                if (conv.id === existing.id) {
                  return {
                    ...conv,
                    id: update.conversationId, // Update to normalized ID if different
                    lastMessage: update.lastMessage,
                    timestamp: update.created_time, // Update timestamp - sorting will move to top
                    unread: true,
                    participantId: update.senderId,
                  };
                }
                return conv;
              });
            } else {
              // New conversation - add to top
              const newConversation: Conversation = {
                id: update.conversationId,
                name: update.from.name || "Unknown User",
                avatar: update.from.profile_pic,
                lastMessage: update.lastMessage,
                timestamp: update.created_time,
                unread: true,
                participantId: update.senderId,
              };

              // Add to beginning - sorting will ensure proper order
              return [newConversation, ...prev];
            }
          });
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
  }, [isIntegrationReady, pageId]);

  useEffect(() => {
    if (selectedConversation && pageAccessToken && pageId) {
      // Fetch initial messages
      fetchMessages(selectedConversation);

      // Get participant ID for better message matching
      const selectedConv = conversations.find(
        c => c.id === selectedConversation
      );
      const participantId = selectedConv?.participantId || "";

      // Set up SSE connection for real-time updates
      const streamUrl = `/api/facebook/conversations/stream?conversationId=${selectedConversation}&pageId=${pageId}${participantId ? `&senderId=${participantId}` : ""}`;
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
                webhookMessage.from.id === pageId
                  ? "You"
                  : webhookMessage.from.name,
              content: webhookMessage.message,
              timestamp: webhookMessage.created_time,
              isOwn: webhookMessage.from.id === pageId,
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

            // Update conversation list to show new message and move to top
            setConversations(prev => {
              const updated = prev.map(conv => {
                if (conv.id === selectedConversation) {
                  return {
                    ...conv,
                    lastMessage: webhookMessage.message,
                    timestamp: webhookMessage.created_time, // Store raw ISO timestamp
                    unread: true,
                  };
                }
                return conv;
              });

              // Move updated conversation to top (sorting will be handled by conversation-list)
              const updatedConv = updated.find(
                c => c.id === selectedConversation
              );
              const others = updated.filter(c => c.id !== selectedConversation);
              return updatedConv ? [updatedConv, ...others] : updated;
            });
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
  }, [selectedConversation, pageAccessToken, pageId]);

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

      // Update conversation timestamp to move it to top
      const now = new Date().toISOString();
      setConversations(prev => {
        const updated = prev.map(conv => {
          if (conv.id === selectedConversation) {
            return {
              ...conv,
              lastMessage: content,
              timestamp: now, // Update timestamp to move to top
            };
          }
          return conv;
        });

        // Move updated conversation to top (sorting will be handled by conversation-list)
        const updatedConv = updated.find(c => c.id === selectedConversation);
        const others = updated.filter(c => c.id !== selectedConversation);
        return updatedConv ? [updatedConv, ...others] : updated;
      });

      await fetchMessages(selectedConversation);
      // Optionally refresh conversations list (but sorting will handle positioning)
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
