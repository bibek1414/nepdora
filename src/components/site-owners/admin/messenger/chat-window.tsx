"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Video, Info } from "lucide-react";
import { ManualOrderDialog } from "@/components/site-owners/admin/orders/manual-order-dialog";
import { cn } from "@/lib/utils";
import {
  MessageData,
  Participant,
  Attachment,
} from "@/types/owner-site/admin/conversations";
import { VoiceMessage } from "./audio-message";
import { VideoMessage } from "./video-message";

interface ChatWindowProps {
  messages: MessageData[];
  conversationName: string;
  conversationAvatar?: string;
  currentUserId?: string;
  participants?: Participant[];
  updated_time?: string;
}

export function ChatWindow({
  messages,
  conversationName,
  conversationAvatar,
  currentUserId,
  participants = [],
  updated_time = "",
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCount = useRef<number>(0);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  // ✅ Sort messages chronologically
  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.created_time).getTime() -
          new Date(b.created_time).getTime()
      ),
    [messages]
  );

  // ✅ Use provided updated_time or fallback to last received message
  const lastActiveTime = useMemo(() => {
    if (updated_time) return updated_time;
    const lastMessage = [...sortedMessages]
      .reverse()
      .find(msg => msg.from.id !== currentUserId);
    return lastMessage?.created_time || "";
  }, [sortedMessages, currentUserId, updated_time]);

  // ✅ Calculate relative last active time
  const getLastActiveTime = useMemo(() => {
    if (!lastActiveTime) return "Not active recently";

    const lastActiveDate = new Date(lastActiveTime);
    const now = new Date();
    const diffMs = now.getTime() - lastActiveDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Active now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    if (diffDays === 1) return "Active yesterday";
    if (diffDays < 7) return `Active ${diffDays}d ago`;

    return `Active ${lastActiveDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}`;
  }, [lastActiveTime]);

  // ✅ Scroll to bottom on new message
  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = messages.length;
  }, [messages]);

  // ✅ Initial scroll
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
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return (
      date.toLocaleDateString([], { month: "short", day: "numeric" }) +
      ", " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getInitials = (name?: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ Render message attachments (stickers, images, audio, video, etc.)
  const renderAttachments = (attachments?: Attachment[]) => {
    if (!attachments?.length) return null;

    return (
      <div className="mt-1 flex flex-wrap gap-2">
        {attachments.map((att, i) => {
          // Handle audio messages (check for both "audio" and MIME types like "audio/mp4")
          if (att.type?.startsWith("audio") && att.url) {
            return (
              <div key={i} className="w-full">
                <VoiceMessage audioSrc={att.url} />
              </div>
            );
          }

          // Handle video messages (check for both "video" and MIME types like "video/mp4")
          if (att.type?.startsWith("video") && att.url) {
            return (
              <div key={i} className="w-full">
                <VideoMessage videoSrc={att.url} />
              </div>
            );
          }

          // Handle stickers and images
          if (
            att.type === "sticker" ||
            att.type === "image" ||
            att.type?.startsWith("image")
          ) {
            return (
              <img
                key={i}
                src={att.url}
                alt={att.type || "attachment"}
                className="max-h-32 rounded-lg border border-gray-200"
              />
            );
          }

          // Handle other file types
          return (
            <a
              key={i}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              {att.type || "Attachment"}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* HEADER */}
      <div className="sticky top-14 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
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
            <p className="text-xs text-gray-500">{getLastActiveTime}</p>
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

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-1">
          {sortedMessages.map((message, index) => {
            const isOwn = message.from.id === currentUserId;
            const showAvatar =
              index === 0 ||
              sortedMessages[index - 1].from.id !== message.from.id;

            const showTimestamp =
              index === 0 ||
              new Date(message.created_time).getTime() -
                new Date(sortedMessages[index - 1].created_time).getTime() >
                600000;

            return (
              <div key={message.id}>
                {/* Timestamp */}
                {showTimestamp && (
                  <div className="my-4 flex justify-center">
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(message.created_time)}
                    </span>
                  </div>
                )}

                <div
                  className={cn(
                    "flex gap-2 transition-all",
                    isOwn && "flex-row-reverse"
                  )}
                  onMouseEnter={() => !isOwn && setHoveredMessageId(message.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {/* Avatar */}
                  {!isOwn && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={message.from.profile_pic}
                            alt={message.from.name}
                          />
                          <AvatarFallback className="bg-blue-500 text-[10px] font-semibold text-white">
                            {getInitials(message.from.name)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-7 w-7" />
                      )}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "group relative",
                      message.attachments?.some(att =>
                        att.type?.startsWith("video")
                      )
                        ? "max-w-[450px]" // Wider for videos
                        : "max-w-[65%]",
                      isOwn && "items-end"
                    )}
                  >
                    {/* Check if message has audio/video attachments */}
                    {message.attachments?.some(
                      att =>
                        att.type?.startsWith("audio") ||
                        att.type?.startsWith("video")
                    ) ? (
                      // Render media without bubble background
                      <div className="w-full space-y-2">
                        {message.message && (
                          <div
                            className={cn(
                              "rounded-2xl px-3 py-2 text-[15px] leading-5 shadow-sm",
                              isOwn
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            )}
                          >
                            <p className="break-words whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                        )}
                        <div className="relative z-10">
                          {renderAttachments(message.attachments)}
                        </div>
                      </div>
                    ) : (
                      // Regular message bubble
                      <div
                        className={cn(
                          "rounded-2xl px-3 py-2 text-[15px] leading-5 shadow-sm",
                          isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        {message.message && (
                          <p className="break-words whitespace-pre-wrap">
                            {message.message}
                          </p>
                        )}
                        {/* ✅ Render attachments inline */}
                        {renderAttachments(message.attachments)}
                      </div>
                    )}

                    {/* Create Order Button */}
                    {!isOwn && hoveredMessageId === message.id && (
                      <div className="absolute -bottom-8 left-0 z-10">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateOrder(message.message)}
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

      {/* MANUAL ORDER DIALOG */}
      {showCreateOrder && (
        <ManualOrderDialog
          open={showCreateOrder}
          onOpenChange={setShowCreateOrder}
          initialMessage={orderMessage}
        />
      )}
    </div>
  );
}
