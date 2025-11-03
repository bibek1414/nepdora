"use client";

import { useState } from "react";
import { Search, MessageCircle, MoreHorizontal, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  participantId?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelectConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h`;
    } else {
      const days = Math.floor(hours / 24);
      if (days === 1) return "1d";
      if (days < 7) return `${days}d`;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex h-full w-[360px] flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="sticky top-13 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
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
        {filteredConversations.length === 0 ? (
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
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "flex w-full items-center gap-3 px-2 py-2 text-left transition-colors hover:bg-gray-100",
                selectedId === conversation.id && "bg-gray-100"
              )}
            >
              {/* Avatar - No unread indicator */}
              <div className="flex-shrink-0">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={conversation.avatar}
                    alt={conversation.name}
                  />
                  <AvatarFallback className="bg-blue-500 text-lg font-semibold text-white">
                    {getInitials(conversation.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-[15px] font-normal text-gray-900">
                    {conversation.name}
                  </h3>
                  <span className="flex-shrink-0 text-xs text-gray-500">
                    {formatTimestamp(conversation.timestamp)}
                  </span>
                </div>

                <p className="truncate text-sm text-gray-600">
                  {conversation.lastMessage}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
