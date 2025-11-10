"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  MessageCircle,
  RefreshCw,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFacebookIntegrations } from "@/hooks/owner-site/admin/use-facebook-integrations";
import { useConversationList } from "@/hooks/owner-site/admin/use-conversation-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ConversationListItem,
  Participant,
} from "@/types/owner-site/admin/conversations";

interface ConversationListProps {
  selectedId: string | null;
  onSelectConversation: (
    conversationId: string,
    data: ConversationListItem
  ) => void;
  onIntegrationChange?: (
    integration: {
      id: number;
      pageId: string;
      pageAccessToken: string;
      pageName: string;
    } | null
  ) => void;
}

export function ConversationList({
  selectedId,
  onSelectConversation,
  onIntegrationChange,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);
  const [collapsed, setCollapsed] = useState(false);

  const { data: integrations = [] } = useFacebookIntegrations();

  const activeIntegration = useMemo(() => {
    if (selectedIntegrationId && integrations.length > 0) {
      const chosen = integrations.find(
        i => String(i.id) === String(selectedIntegrationId)
      );
      if (chosen) return chosen;
    }
    return integrations[0] || null;
  }, [integrations, selectedIntegrationId]);

  const pageId = activeIntegration?.page_id || null;

  // Use the new hook with real-time updates
  const {
    data: conversationsData = [],
    refetch,
    isLoading,
    isFetching,
  } = useConversationList(pageId);

  // Auto-select first integration
  useMemo(() => {
    if (integrations.length > 0 && !selectedIntegrationId) {
      const firstIntegration = integrations[0];
      setSelectedIntegrationId(String(firstIntegration.id));
      onIntegrationChange?.({
        id: firstIntegration.id!,
        pageId: firstIntegration.page_id,
        pageAccessToken: firstIntegration.page_access_token,
        pageName: firstIntegration.page_name,
      });
    }
  }, [integrations, selectedIntegrationId, onIntegrationChange]);

  // Sort conversations by updated_time (most recent first)
  const conversations = useMemo(() => {
    if (!conversationsData || !Array.isArray(conversationsData)) return [];
    return [...conversationsData].sort((a, b) => {
      const timeA = new Date(a.updated_time || 0).getTime();
      const timeB = new Date(b.updated_time || 0).getTime();
      return timeB - timeA;
    });
  }, [conversationsData]);

  const handleIntegrationSelect = useCallback(
    (value: string) => {
      setSelectedIntegrationId(value);
      const selected = integrations.find(i => String(i.id) === value);

      if (selected) {
        onIntegrationChange?.({
          id: selected.id!,
          pageId: selected.page_id,
          pageAccessToken: selected.page_access_token,
          pageName: selected.page_name,
        });
      } else {
        onIntegrationChange?.(null);
      }
    },
    [integrations, onIntegrationChange]
  );

  const filteredConversations = conversations.filter(
    (conv: ConversationListItem) => {
      const otherParticipant = conv.participants.find(
        (p: Participant) => p.id !== pageId
      );
      const name = otherParticipant?.name || "Unknown";
      const snippet = conv.snippet || "";
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  );

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return "";

      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (minutes < 1) return "now";
      if (minutes < 60) return `${minutes}m`;
      if (hours < 24) return `${hours}h`;
      const days = Math.floor(hours / 24);
      if (days === 1) return "yesterday";
      if (days < 7) return `${days}d`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const getMessagePreview = (conversation: ConversationListItem) => {
    const messageType = conversation.message_type;
    const snippet = conversation.snippet || "";

    // Check if snippet contains attachment pattern like "[6 attachment(s)]"
    const attachmentMatch = snippet.match(/\[(\d+)\s+attachment\(s\)\]/i);

    // Determine message preview based on message type
    if (messageType === "audio") {
      return "Sent a voice message";
    }
    if (messageType === "image") {
      const count = attachmentMatch ? parseInt(attachmentMatch[1]) : 1;
      return count > 1 ? `Sent ${count} photos` : "Sent a photo";
    }
    if (messageType === "video") {
      return "Sent a video";
    }
    if (messageType === "file") {
      return "Sent a file";
    }

    // If snippet has attachment pattern but no message_type
    // Without message_type, we cannot accurately determine the attachment type
    // Show generic message for old conversations
    if (attachmentMatch) {
      const count = parseInt(attachmentMatch[1]);
      if (count === 1) {
        return "Sent an attachment";
      }
      return `Sent ${count} attachments`;
    }

    return snippet || "No messages yet";
  };

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-gray-200 bg-white py-15 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-full sm:w-[320px] md:w-[360px]"
      )}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-3 py-3 md:px-4">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-900 md:text-2xl">Chats</h1>
        )}
        <div
          className={cn(
            "flex items-center gap-1 md:gap-2",
            collapsed && "mx-auto"
          )}
        >
          {!collapsed && (
            <>
              <Select
                value={
                  activeIntegration?.id ? String(activeIntegration.id) : ""
                }
                onValueChange={handleIntegrationSelect}
                disabled={integrations.length === 0}
              >
                <SelectTrigger className="h-8 w-28 text-left text-xs sm:h-9 sm:w-40 sm:text-sm">
                  <SelectValue
                    placeholder={
                      integrations.length === 0
                        ? "No Pages"
                        : activeIntegration?.page_name || "Select Page"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {integrations.map(i => (
                    <SelectItem key={i.id} value={String(i.id)}>
                      {i.page_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <button
                onClick={() => refetch()}
                className={cn(
                  "rounded-full p-1.5 text-gray-600 hover:bg-gray-100 md:p-2",
                  isFetching && "animate-spin"
                )}
                title="Refresh"
                disabled={!pageId || isFetching}
              >
                <RefreshCw className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-full p-2 text-gray-600 hover:bg-gray-100 md:block"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search Messages"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 rounded-full border-0 bg-gray-100 pl-9 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 sm:h-9"
            />
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            {!collapsed && "Loading chats..."}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <MessageCircle
              className={cn(
                "mb-3 text-gray-300",
                collapsed ? "h-6 w-6" : "h-12 w-12"
              )}
            />
            {!collapsed && (
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
            )}
          </div>
        ) : (
          filteredConversations.map((conversation: ConversationListItem) => {
            const otherParticipant = conversation.participants.find(
              (p: { id: string }) => p.id !== pageId
            );
            const name = otherParticipant?.name || "Unknown";
            const avatar = otherParticipant?.profile_pic;
            const isActive = selectedId === conversation.conversation_id;

            return (
              <button
                key={conversation.conversation_id}
                onClick={() =>
                  conversation.conversation_id &&
                  onSelectConversation(
                    conversation.conversation_id,
                    conversation
                  )
                }
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 sm:gap-3 sm:px-4 sm:py-3",
                  isActive ? "bg-blue-50" : "",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? name : undefined}
              >
                <Avatar
                  className={cn(
                    "flex-shrink-0",
                    collapsed ? "h-10 w-10" : "h-11 w-11 sm:h-14 sm:w-14"
                  )}
                >
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="bg-blue-500 text-lg font-semibold text-white">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>

                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-baseline justify-between gap-2">
                      <h3 className="truncate text-sm font-normal text-gray-900 sm:text-[15px]">
                        {name}
                      </h3>
                      <span className="flex-shrink-0 text-[10px] text-gray-500 sm:text-xs">
                        {formatTimestamp(conversation.updated_time)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-gray-600 sm:text-sm">
                      {getMessagePreview(conversation)}
                    </p>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
