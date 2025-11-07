"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MessageCircle, MoreHorizontal, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFacebookIntegrations } from "@/hooks/owner-site/admin/use-facebook-integrations";
import { useConversations } from "@/hooks/owner-site/admin/use-conversations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConversationListItem } from "@/types/owner-site/admin/conversations";

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

  const { data: integrations = [] } = useFacebookIntegrations();

  const activeIntegration = useMemo(() => {
    // If we have a selected integration, use it
    if (selectedIntegrationId && integrations.length > 0) {
      const chosen = integrations.find(
        i => String(i.id) === String(selectedIntegrationId)
      );
      if (chosen) return chosen;
    }

    // Otherwise use the first available integration
    return integrations[0] || null;
  }, [integrations, selectedIntegrationId]);

  // Set initial integration when integrations load
  useEffect(() => {
    if (integrations.length > 0 && !selectedIntegrationId) {
      setSelectedIntegrationId(String(integrations[0].id));
    }
  }, [integrations, selectedIntegrationId]);

  const pageId = activeIntegration?.page_id || null;

  // Fetch conversations using our new hook
  const {
    data: conversations = [],
    refetch,
    isLoading,
  } = useConversations(pageId);

  // Notify parent when integration changes
  useEffect(() => {
    if (activeIntegration && pageId && activeIntegration.id !== undefined) {
      onIntegrationChange?.({
        id: activeIntegration.id,
        pageId: activeIntegration.page_id,
        pageAccessToken: activeIntegration.page_access_token,
        pageName: activeIntegration.page_name,
      });
    } else if (integrations.length === 0) {
      onIntegrationChange?.(null);
    }
  }, [activeIntegration, pageId, onIntegrationChange, integrations.length]);

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.id !== pageId);
    const name = otherParticipant?.name || "Unknown";
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.snippet.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m`;
    if (hours < 24) return `${Math.floor(hours)}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-full w-[360px] flex-col border-r border-gray-200 bg-white py-15">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
        <div className="flex items-center gap-2">
          <Select
            value={
              activeIntegration?.id ? String(activeIntegration.id) : undefined
            }
            onValueChange={value => setSelectedIntegrationId(value)}
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
            onClick={() => refetch()}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            title="Refresh"
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
          filteredConversations.map(conversation => {
            const otherParticipant = conversation.participants.find(
              p => p.id !== pageId
            );
            const name = otherParticipant?.name || "Unknown User";
            const avatar = otherParticipant?.profile_pic;

            return (
              <button
                key={conversation.conversation_id}
                onClick={() =>
                  onSelectConversation(
                    conversation.conversation_id,
                    conversation
                  )
                }
                className={cn(
                  "flex w-full items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-gray-100",
                  selectedId === conversation.conversation_id && "bg-gray-100"
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
