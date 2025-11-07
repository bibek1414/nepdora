"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, MessageCircle, MoreHorizontal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFacebookIntegrations } from "@/hooks/owner-site/admin/use-facebook-integrations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
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

// ------------------- Conversation List Component -------------------
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
  const queryClient = useQueryClient();
  const { data: integrations = [] } = useFacebookIntegrations();

  // Set the first integration as selected if none is selected
  useEffect(() => {
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

  const activeIntegration = useMemo(() => {
    if (selectedIntegrationId && integrations.length > 0) {
      const chosen = integrations.find(
        i => String(i.id) === String(selectedIntegrationId)
      );
      if (chosen) return chosen;
    }
    return integrations[0] || null;
  }, [integrations, selectedIntegrationId]);

  const safeIntegrationId = activeIntegration?.id
    ? String(activeIntegration.id)
    : "";
  const pageId = activeIntegration?.page_id || null;

  const {
    data: conversations = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["conversations", pageId],
    queryFn: async () => {
      if (!pageId) return [];

      const localData = localStorage.getItem(`conversations_${pageId}`);
      const localConversations = localData ? JSON.parse(localData) : [];

      try {
        const serverData = await useConversationsApi.getConversations(pageId);
        const merged = [
          ...serverData,
          ...localConversations.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (lc: any) =>
              !serverData.some(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (sc: any) => sc.conversation_id === lc.conversation_id
              )
          ),
        ];
        localStorage.setItem(`conversations_${pageId}`, JSON.stringify(merged));
        return merged;
      } catch (error) {
        console.error("Error fetching conversations:", error);
        return localConversations;
      }
    },
    enabled: !!pageId,
    staleTime: 30000,
  });

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

  return (
    <div className="flex h-full w-[360px] flex-col border-r border-gray-200 bg-white py-15">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
        <div className="flex items-center gap-2">
          <Select
            value={activeIntegration?.id ? String(activeIntegration.id) : ""}
            onValueChange={handleIntegrationSelect}
            disabled={integrations.length === 0}
          >
            <SelectTrigger className="h-9 w-40 text-left">
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
            onClick={() => {
              if (pageId) {
                refetch();
                queryClient.invalidateQueries({
                  queryKey: ["conversations", pageId],
                });
              }
            }}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            title="Refresh"
            disabled={!pageId}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-2 py-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search Messages"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-9 rounded-full border-0 bg-gray-100 pl-9 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            Loading chats...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <MessageCircle className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm text-gray-500">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
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
                  "flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50",
                  isActive ? "bg-blue-50" : ""
                )}
              >
                <Avatar className="h-14 w-14 flex-shrink-0">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="bg-blue-500 text-lg font-semibold text-white">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-baseline justify-between gap-2">
                    <h3 className="truncate text-[15px] font-normal text-gray-900">
                      {name}
                    </h3>
                    <span className="flex-shrink-0 text-xs text-gray-500">
                      {formatTimestamp(conversation.updated_time)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-gray-600">
                    {conversation.snippet || "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
