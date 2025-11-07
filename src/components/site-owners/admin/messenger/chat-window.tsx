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

interface ChatWindowProps {
  messages: MessageData[];
  conversationName: string;
  conversationAvatar?: string;
  currentUserId?: string;
  participants?: Participant[];
  updated_time?: string;
}

// ✅ Separate component for audio attachments
interface AudioAttachmentProps {
  url: string;
  attachmentId: string;
  isPlaying: boolean;
  onPlay: (id: string, url: string) => void;
  audioRefs: React.MutableRefObject<{ [key: string]: HTMLAudioElement }>;
}

const AudioAttachment: React.FC<AudioAttachmentProps> = ({
  url,
  attachmentId,
  isPlaying,
  onPlay,
  audioRefs,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRefs.current[attachmentId]) return;

    const audio = audioRefs.current[attachmentId];

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [attachmentId, audioRefs]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex w-full max-w-xs flex-col gap-1 rounded-lg border border-gray-300 bg-white p-2">
      <button
        onClick={() => url && onPlay(attachmentId, url)}
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <svg
            className="h-5 w-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 3.3A1 1 0 015 4v12a1 1 0 001.7.7l8-6a1 1 0 000-1.4l-8-6a1 1 0 00-.4-.3z" />
          </svg>
        )}
        <span className="text-sm text-gray-700">
          {isPlaying ? "Pause" : "Play"}
        </span>
      </button>

      <div className="relative h-1 w-full rounded bg-gray-200">
        <div
          className="absolute top-0 left-0 h-1 rounded bg-blue-600"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

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

  // ✅ Audio tracking
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const handleAudioPlay = (attachmentId: string, audioUrl: string) => {
    // Stop currently playing audio
    if (playingAudioId && audioRefs.current[playingAudioId]) {
      audioRefs.current[playingAudioId].pause();
      audioRefs.current[playingAudioId].currentTime = 0;
    }

    if (!audioRefs.current[attachmentId]) {
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudioId(null);
      audioRefs.current[attachmentId] = audio;
    }

    const audio = audioRefs.current[attachmentId];

    if (playingAudioId === attachmentId) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      audio.play();
      setPlayingAudioId(attachmentId);
    }
  };

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  // ✅ Sort messages
  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.created_time).getTime() -
          new Date(b.created_time).getTime()
      ),
    [messages]
  );

  const lastActiveTime = useMemo(() => {
    if (updated_time) return updated_time;
    const lastMessage = [...sortedMessages]
      .reverse()
      .find(msg => msg.from.id !== currentUserId);
    return lastMessage?.created_time || "";
  }, [sortedMessages, currentUserId, updated_time]);

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

    return `Active ${lastActiveDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }, [lastActiveTime]);

  useEffect(() => {
    if (messages.length > prevMessageCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageCount.current = messages.length;
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const renderAttachments = (
    attachments?: Attachment[],
    messageId?: string
  ) => {
    if (!attachments?.length) return null;

    return (
      <div className="mt-1 flex flex-wrap gap-2">
        {attachments.map((att, i) => {
          const attachmentId = `${messageId}-${i}`;
          const isPlaying = playingAudioId === attachmentId;

          if (att.type === "audio" || att.type === "voice") {
            return (
              <AudioAttachment
                key={i}
                url={att.url!}
                attachmentId={attachmentId}
                isPlaying={isPlaying}
                onPlay={handleAudioPlay}
                audioRefs={audioRefs}
              />
            );
          }

          if (att.type === "sticker" || att.type === "image") {
            return (
              <img
                key={i}
                src={att.url!}
                alt={att.type || "attachment"}
                className="max-h-64 max-w-full cursor-pointer rounded-lg border border-gray-200 object-cover transition-transform hover:scale-105"
                onClick={() => window.open(att.url!, "_blank")}
              />
            );
          }

          return (
            <a
              key={i}
              href={att.url!}
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
      <div className="sticky top-14 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
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

                  <div
                    className={cn(
                      "group relative max-w-[65%]",
                      isOwn && "items-end"
                    )}
                  >
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
                      {renderAttachments(message.attachments, message.id)}
                    </div>

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
