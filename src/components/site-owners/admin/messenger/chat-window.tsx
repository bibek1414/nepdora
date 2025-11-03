"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Video, Info } from "lucide-react";
import { CreateManualOrderDialog } from "@/components/site-owners/admin/manual-order/create-manual-order-dialog";

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  senderProfilePic?: string;
}

interface ChatWindowProps {
  messages: Message[];
  conversationName: string;
  conversationAvatar?: string;
}

export function ChatWindow({
  messages,
  conversationName,
  conversationAvatar,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Get the last message from the other person (not own messages)
  const getLastActiveTime = () => {
    const lastOtherPersonMessage = [...sortedMessages]
      .reverse()
      .find(msg => !msg.isOwn);

    if (!lastOtherPersonMessage) {
      return "Not active recently";
    }

    const lastActiveDate = new Date(lastOtherPersonMessage.timestamp);
    const now = new Date();
    const diffMs = now.getTime() - lastActiveDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) {
      return "Active now";
    } else if (diffMins < 60) {
      return `Active ${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `Active ${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Active yesterday";
    } else if (diffDays < 7) {
      return `Active ${diffDays}d ago`;
    } else {
      return `Active ${lastActiveDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }
  };

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  const handleCreateOrder = (message: string) => {
    setOrderMessage(message);
    setShowCreateOrder(true);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return (
        date.toLocaleDateString([], { month: "short", day: "numeric" }) +
        ", " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Header - Sticky at top */}
      <div className="sticky top-14 z-10 flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversationAvatar} alt={conversationName} />
            <AvatarFallback className="bg-blue-500 text-sm font-semibold text-white">
              {getInitials(conversationName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900">
              {conversationName}
            </h2>
            <p className="text-xs text-gray-500">{getLastActiveTime()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Phone className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Video className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-1">
          {sortedMessages.map((message, index) => {
            const showAvatar =
              index === 0 ||
              sortedMessages[index - 1].sender !== message.sender;
            const showTimestamp =
              index === 0 ||
              new Date(message.timestamp).getTime() -
                new Date(sortedMessages[index - 1].timestamp).getTime() >
                600000;

            return (
              <div key={message.id}>
                {/* Timestamp Separator */}
                {showTimestamp && (
                  <div className="my-4 flex justify-center">
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "flex gap-2 transition-all",
                    message.isOwn && "flex-row-reverse"
                  )}
                  onMouseEnter={() =>
                    !message.isOwn && setHoveredMessageId(message.id)
                  }
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {/* Avatar */}
                  {!message.isOwn && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={message.senderProfilePic}
                            alt={message.sender}
                          />
                          <AvatarFallback className="bg-blue-500 text-[10px] font-semibold text-white">
                            {getInitials(message.sender)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-7 w-7" />
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "group relative max-w-[65%]",
                      message.isOwn && "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 text-[15px] leading-5 shadow-sm",
                        message.isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {/* Create Order Button */}
                    {!message.isOwn && hoveredMessageId === message.id && (
                      <div className="absolute -bottom-8 left-0 z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateOrder(message.content)}
                          className="h-7 rounded-full border-gray-300 bg-white text-xs shadow-md hover:bg-gray-50"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Create Order
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Manual Order Dialog */}
      {showCreateOrder && (
        <CreateManualOrderDialog
          open={showCreateOrder}
          onOpenChange={setShowCreateOrder}
          initialMessage={orderMessage}
        />
      )}
    </div>
  );
}
