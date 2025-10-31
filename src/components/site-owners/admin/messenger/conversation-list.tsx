"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar?: string; // Made optional to match the page component's interface
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  participantId?: string; // Added to match the page component's interface
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
  return (
    <div className="border-border bg-card flex w-80 flex-col border-r">
      {/* Header */}
      <div className="border-border border-b p-4">
        <h1 className="text-foreground mb-4 text-2xl font-bold">Messenger</h1>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search conversations..."
            className="bg-muted text-foreground placeholder:text-muted-foreground pl-10"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map(conversation => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              "hover:bg-muted border-border flex w-full items-center gap-3 border-b px-4 py-3 transition-colors",
              selectedId === conversation.id && "bg-muted"
            )}
          >
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage
                src={conversation.avatar || "/placeholder.svg"}
                alt={conversation.name}
              />
              <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <div className="flex items-center justify-between gap-2">
                <h3
                  className={cn(
                    "text-foreground truncate font-semibold",
                    conversation.unread && "font-bold"
                  )}
                >
                  {conversation.name}
                </h3>
                <span className="text-muted-foreground flex-shrink-0 text-xs">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-muted-foreground truncate text-sm">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && (
              <div className="bg-primary h-2 w-2 flex-shrink-0 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
