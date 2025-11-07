"use client";

import { useState, useEffect, useCallback } from "react";
import { ConversationList } from "@/components/site-owners/admin/messenger/conversation-list";
import { ChatWindow } from "@/components/site-owners/admin/messenger/chat-window";
import { MessageInput } from "@/components/site-owners/admin/messenger/message-input";
import {
  useConversationMessages,
  useSendMessage,
} from "@/hooks/owner-site/admin/use-conversations";
import {
  ConversationListItem,
  MessageData,
} from "@/types/owner-site/admin/conversations";
import { useFacebookIntegrations } from "@/hooks/owner-site/admin/use-facebook-integrations";

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderProfilePic?: string;
}

export default function MessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedConversationData, setSelectedConversationData] =
    useState<ConversationListItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<{
    id: number;
    pageId: string;
    pageAccessToken: string;
    pageName: string;
  } | null>(null);
  const [integrationsLoaded, setIntegrationsLoaded] = useState(false);

  const { data: integrations = [], isLoading: integrationsLoading } =
    useFacebookIntegrations();

  const { data: conversationDetail, isLoading: isLoadingMessages } =
    useConversationMessages(selectedConversationId);

  const sendMessageMutation = useSendMessage();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Reset error when integrations load
  useEffect(() => {
    if (integrations.length > 0) {
      setError(null);
      setIntegrationsLoaded(true);
    } else if (integrations.length === 0 && integrationsLoaded) {
      setError("No Facebook pages connected. Please connect a page first.");
    }
  }, [integrations, integrationsLoaded]);

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
      setSelectedConversationId(null);
      setSelectedConversationData(null);
      setError(null); // Clear error when integration changes

      if (!integration && integrations.length === 0) {
        setError("No Facebook pages connected. Please connect a page first.");
      } else if (!integration) {
        setError("Please select a Facebook page from the dropdown.");
      }
    },
    [integrations.length]
  );

  // Transform backend messages to frontend format
  const messages: Message[] =
    conversationDetail?.conversation?.messages?.map((msg: MessageData) => ({
      id: msg.id,
      conversationId: conversationDetail.conversation.conversation_id,
      sender:
        msg.from.id === selectedIntegration?.pageId ? "You" : msg.from.name,
      content: msg.message,
      timestamp: msg.created_time,
      isOwn: msg.from.id === selectedIntegration?.pageId,
      senderProfilePic: msg.from.profile_pic,
    })) || [];

  const handleSendMessage = async (content: string) => {
    if (
      !selectedConversationId ||
      !selectedIntegration ||
      !selectedConversationData
    )
      return;

    try {
      // Get participant ID (the other person in the conversation)
      const participantId = selectedConversationData.participants.find(
        p => p.id !== selectedIntegration.pageId
      )?.id;

      if (!participantId) {
        throw new Error("Could not find participant ID");
      }

      // Send message using ONLY recipient_id and conversationId
      await sendMessageMutation.mutateAsync({
        recipient_id: participantId, // This is the PSID (Page-Scoped ID)
        message: content,
        page_access_token: selectedIntegration.pageAccessToken,
        conversationId: selectedConversationId, // Only for cache invalidation
      });

      console.log("✅ Message sent to:", participantId);
      console.log("📝 Conversation ID:", selectedConversationId);
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("❌ Error sending message:", err);

      if (err.response?.data?.error?.code === 100) {
        setError(
          "Cannot send message. User must message the page first to start a conversation."
        );
      } else if (err.response?.data?.error?.code === 10) {
        setError("Page access token has expired or is invalid.");
      } else {
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleSelectConversation = (
    conversationId: string,
    data: ConversationListItem
  ) => {
    setSelectedConversationId(conversationId);
    setSelectedConversationData(data);
    setError(null); // Clear any previous errors when selecting a conversation
  };

  // Show loading state while checking integrations
  if (integrationsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-500">Loading Facebook pages...</p>
        </div>
      </div>
    );
  }

  // Show error state only when there are truly no integrations
  if (error && integrations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-4xl">⚠️</div>
          <p className="mb-4 text-red-500">{error}</p>
          <a
            href="/admin/facebook"
            className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Go to Integrations
          </a>
        </div>
      </div>
    );
  }

  const conversationName =
    selectedConversationData?.participants.find(
      p => p.id !== selectedIntegration?.pageId
    )?.name || "Conversation";

  const conversationAvatar = selectedConversationData?.participants.find(
    p => p.id !== selectedIntegration?.pageId
  )?.profile_pic;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <ConversationList
        selectedId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onIntegrationChange={handleIntegrationChange}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedConversationId && selectedIntegration ? (
          <>
            {isLoadingMessages ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-5xl">⏳</div>
                  <p className="text-lg text-gray-500">Loading messages...</p>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 p-3 text-center">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <ChatWindow
                  messages={messages}
                  conversationName={conversationName}
                  conversationAvatar={conversationAvatar}
                />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={
                    !selectedIntegration || sendMessageMutation.isPending
                  }
                />
              </>
            )}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 text-5xl">💬</div>
              <p className="text-lg text-gray-500">
                {!selectedIntegration
                  ? integrations.length === 0
                    ? "No Facebook pages connected"
                    : "Please select a Facebook page from the dropdown"
                  : "Select a conversation to start messaging"}
              </p>
              {integrations.length === 0 && (
                <a
                  href="/admin/settings/integrations"
                  className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Connect Facebook Page
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
