"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationList } from "@/components/site-owners/admin/messenger/conversation-list";
import { ChatWindow } from "@/components/site-owners/admin/messenger/chat-window";
import { MessageInput } from "@/components/site-owners/admin/messenger/message-input";
import {
  getConversations,
  sendMessage as sendFacebookMessage,
  formatTimestamp,
  FacebookConversation,
  FacebookMessage as FbMessage,
  FacebookUser,
} from "@/lib/facebook";

const PAGE_ID = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || "";

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
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

  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const fbConversations = await getConversations();

      const formattedConversations = fbConversations.map(conv => {
        const participant = conv.participants.data.find(p => p.id !== PAGE_ID);
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
      setError("Failed to load conversations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedConversation]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/facebook/conversations/${conversationId}/messages`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();

      const formattedMessages = data.messages.map((msg: FbMessage) => ({
        id: msg.id,
        conversationId,
        sender: msg.from.id === PAGE_ID ? "You" : msg.from.name,
        content: msg.message,
        timestamp: formatTimestamp(msg.created_time),
        isOwn: msg.from.id === PAGE_ID,
      }));

      // Reverse to show oldest messages first (Facebook returns newest first by default)
      setMessages(formattedMessages.reverse());
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();

    // Set up polling for new messages
    const interval = setInterval(fetchConversations, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;

    // Define tempId at the function level
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
        timestamp: formatTimestamp(new Date().toISOString()),
        isOwn: true,
      };

      setMessages(prev => [...prev, newMessage]);

      // Send to Facebook
      await sendFacebookMessage(conversation.participantId, content);

      // Refresh messages to get the real message ID from Facebook
      fetchMessages(selectedConversation);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");

      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchConversations}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // In page.tsx
  // ... (existing imports and code)

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="border-border flex h-full w-80 flex-col border-r">
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {selectedConversation ? (
            <div className="flex h-full flex-col">
              <ChatWindow
                messages={messages}
                conversationName={
                  conversations.find(c => c.id === selectedConversation)
                    ?.name || "Conversation"
                }
              />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="text-muted-foreground flex flex-1 items-center justify-center">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
