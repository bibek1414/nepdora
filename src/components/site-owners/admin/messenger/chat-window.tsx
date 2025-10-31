"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateManualOrderDialog } from "@/components/site-owners/admin/manual-order/create-manual-order-dialog";

interface Message {
  id: string;
  conversationId: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatWindowProps {
  messages: Message[];
  conversationName: string;
}

export function ChatWindow({ messages, conversationName }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  // ✅ Sort oldest → newest
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // ✅ Scroll to bottom when a new message is added
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // ✅ Initial scroll when component mounts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  const handleCreateOrder = (message: string) => {
    setOrderMessage(message);
    setShowCreateOrder(true);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-foreground text-lg font-semibold">
          {conversationName}
        </h2>
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-4">
          {sortedMessages.map(message => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.isOwn && "flex-row-reverse")}
              onMouseEnter={() =>
                !message.isOwn && setSelectedMessageId(message.id)
              }
              onMouseLeave={() => setSelectedMessageId(null)}
            >
              {!message.isOwn && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "relative flex max-w-md flex-col gap-1",
                  message.isOwn && "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 break-words",
                    message.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  )}
                >
                  <p className="text-sm">{message.content}</p>

                  {/* Show create order button only for selected customer messages */}
                  {!message.isOwn && selectedMessageId === message.id && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateOrder(message.content)}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Create Order
                      </Button>
                    </div>
                  )}
                </div>

                <span className="text-muted-foreground text-xs">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {/* anchor for scroll */}
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
