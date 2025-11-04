"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Search, MessageCircle, MoreHorizontal, Edit } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { messageStore, StoredMessage } from "@/lib/message-store";
import { useFacebook } from "@/contexts/FacebookContext";
import { useFacebookIntegrations } from "@/hooks/owner-site/admin/use-facebook-integrations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  snippet?: string;
  timestamp?: string;
  updated_time?: string;
  unread: boolean;
  participantId?: string;
}

interface ConversationListProps {
  selectedId: string | null;
  onSelectConversation: (id: string, conversation?: Conversation) => void;
  onIntegrationChange?: (
    integration: {
      id: number;
      pageId: string;
      pageAccessToken: string;
      pageName: string;
    } | null
  ) => void;
}

// Transform Facebook API conversations into local Conversation shape
function mapFbConversations(
  fbConversations: Array<{
    id: string;
    participants: {
      data: Array<{ id: string; name: string; profile_pic?: string }>;
    };
    updated_time: string;
    unread_count?: number;
    messages?: { data?: Array<{ message?: string; created_time?: string }> };
  }>,
  pageId: string
): Conversation[] {
  return (fbConversations || []).map(conv => {
    const participant = conv.participants?.data?.find(p => p.id !== pageId);
    const lastMessage = conv.messages?.data?.[0];
    return {
      id: conv.id,
      name: participant?.name || "Unknown User",
      avatar: participant?.profile_pic,
      lastMessage: lastMessage?.message || "No messages",
      timestamp: lastMessage?.created_time || conv.updated_time,
      updated_time: conv.updated_time,
      unread: (conv.unread_count || 0) > 0,
      participantId: participant?.id,
    } as Conversation;
  });
}

export function ConversationList({
  selectedId,
  onSelectConversation,
  onIntegrationChange,
}: ConversationListProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const { integration } = useFacebook();
  const { data: integrations = [] } = useFacebookIntegrations();
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);

  const activeIntegration = useMemo(() => {
    const chosen = integrations.find(
      i => String(i.id) === String(selectedIntegrationId || "")
    );
    if (chosen) return chosen;
    if (integration) return integration;
    // default to first available integration if any
    return integrations[0] ?? null;
  }, [integrations, selectedIntegrationId, integration]);

  const pageId = activeIntegration?.page_id;
  const pageAccessToken = activeIntegration?.page_access_token;
  const lastNotifiedIntegrationId = useRef<number | null>(null);

  // Notify parent when integration changes (only when integration ID actually changes)
  useEffect(() => {
    const currentIntegrationId = activeIntegration?.id || null;

    // Only notify if the integration ID actually changed
    if (lastNotifiedIntegrationId.current === currentIntegrationId) {
      return;
    }

    lastNotifiedIntegrationId.current = currentIntegrationId;

    if (
      activeIntegration &&
      activeIntegration.id &&
      pageId &&
      pageAccessToken
    ) {
      onIntegrationChange?.({
        id: activeIntegration.id,
        pageId,
        pageAccessToken,
        pageName: activeIntegration.page_name,
      });
    } else {
      onIntegrationChange?.(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIntegration?.id, pageId, pageAccessToken]); // Only depend on ID, not the whole object

  // ✅ Fetch conversations using React Query
  const {
    data: items = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["conversations", pageId],
    queryFn: async () => {
      if (!pageId || !pageAccessToken) return [] as Conversation[];
      const url = `/api/facebook/conversations?pageId=${encodeURIComponent(
        pageId
      )}&pageAccessToken=${encodeURIComponent(pageAccessToken)}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const fbConversations = await res.json();
      return mapFbConversations(fbConversations, pageId);
    },
    staleTime: 10_000, // 10s, adjust as needed
    refetchOnWindowFocus: true,
    enabled: Boolean(pageId && pageAccessToken),
  });

  // ✅ Handle real-time updates from messageStore
  useEffect(() => {
    const handleNewMessage = (msg: StoredMessage) => {
      queryClient.setQueryData<Conversation[]>(
        ["conversations", pageId],
        old => {
          if (!old) return old;

          // Find target conversation
          const idx = old.findIndex(c => c.id === msg.conversationId);
          if (idx === -1) return old; // Optionally trigger refetch if missing

          const updatedConv: Conversation = {
            ...old[idx],
            snippet: msg.message,
            updated_time: msg.created_time,
            unread: msg.conversationId !== selectedId,
          };

          // Move to top
          const next = [
            updatedConv,
            ...old.filter(c => c.id !== msg.conversationId),
          ];
          return next;
        }
      );
    };

    messageStore.on("newMessage", handleNewMessage);
    return () => {
      messageStore.removeListener("newMessage", handleNewMessage);
    };
  }, [queryClient, selectedId, pageId]);

  // ✅ Mark selected conversation as read
  useEffect(() => {
    if (!selectedId) return;
    queryClient.setQueryData<Conversation[]>(
      ["conversations", pageId],
      old =>
        old?.map(c => (c.id === selectedId ? { ...c, unread: false } : c)) ?? []
    );
  }, [selectedId, queryClient, pageId]);

  const filteredConversations = items.filter(
    conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.snippet || conv.lastMessage || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "";
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
    <div className="flex h-full w-[360px] flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="sticky top-13 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
        </div>
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
                placeholder={activeIntegration?.page_name || "Select Page"}
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
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
          <button
            onClick={() => refetch()}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100"
            title="Refresh"
          >
            <Edit className="h-5 w-5" />
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
          filteredConversations.map(conversation => (
            <button
              key={conversation.id}
              onClick={() =>
                onSelectConversation(conversation.id, conversation)
              }
              className={cn(
                "flex w-full items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-gray-100",
                selectedId === conversation.id && "bg-gray-100"
              )}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={conversation.avatar}
                    alt={conversation.name}
                  />
                  <AvatarFallback className="bg-blue-500 text-lg font-semibold text-white">
                    {getInitials(conversation.name)}
                  </AvatarFallback>
                </Avatar>
                {conversation.unread && (
                  <span className="absolute -top-0.5 -right-0.5 block h-3 w-3 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-baseline justify-between gap-2">
                  <h3
                    className={cn(
                      "truncate text-[15px]",
                      conversation.unread
                        ? "font-semibold text-gray-900"
                        : "font-normal text-gray-900"
                    )}
                  >
                    {conversation.name}
                  </h3>
                  <span className="flex-shrink-0 text-xs text-gray-500">
                    {formatTimestamp(
                      conversation.updated_time ||
                        conversation.timestamp ||
                        new Date().toISOString()
                    )}
                  </span>
                </div>

                <p
                  className={cn(
                    "truncate text-sm",
                    conversation.unread
                      ? "font-semibold text-gray-900"
                      : "text-gray-600"
                  )}
                >
                  {conversation.snippet ||
                    conversation.lastMessage ||
                    "No messages yet"}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
