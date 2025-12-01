"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus, Image as ImageIcon, Mic, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { VoiceRecorderModal } from "./voice-recorder-modal";

interface MessageInputProps {
  onSendMessage: (content: string, tag?: string) => Promise<void>;
  onSendMedia?: (
    file: File | Blob,
    type: "image" | "audio" | "video"
  ) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  onSendMedia,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [useHumanAgentTag, setUseHumanAgentTag] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(
        trimmed,
        useHumanAgentTag ? "HUMAN_AGENT" : undefined
      );
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(
        error?.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendMedia) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 25MB for Facebook)
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Image size must be less than 25MB");
      return;
    }

    setIsSending(true);
    try {
      await onSendMedia(file, "image");
      toast.success("Image sent successfully");
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending image:", error);
      toast.error("Failed to send image");
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceClick = () => {
    setIsVoiceModalOpen(true);
  };

  const handleSendVoice = async (audioBlob: Blob) => {
    if (!onSendMedia) return;

    try {
      await onSendMedia(audioBlob, "audio");
      toast.success("Voice message sent successfully");
    } catch (error) {
      console.error("Error sending voice message:", error);
      toast.error("Failed to send voice message");
      throw error;
    }
  };

  return (
    <>
      <div className="sticky z-20 border-t border-gray-200 bg-white px-2 py-2 md:px-4">
        <div className="mx-auto max-w-3xl">
          {/* Human Agent Tag Toggle */}
          <div className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="human-agent-tag"
              checked={useHumanAgentTag}
              onChange={e => setUseHumanAgentTag(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="human-agent-tag"
              className="cursor-pointer text-xs text-gray-600 select-none"
            >
              Use Extended 7-Day Support Reply Window (Human Agent Tag)
            </label>
          </div>

          <div className="flex items-end gap-1.5 md:gap-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Left action buttons */}
            <div className="flex gap-0.5 pb-2 md:gap-1">
              <button
                type="button"
                onClick={handleImageClick}
                disabled={disabled || isSending}
                className="rounded-full p-1.5 text-blue-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:p-2"
                title="Send image"
              >
                <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                type="button"
                onClick={handleVoiceClick}
                disabled={disabled || isSending}
                className="rounded-full p-1.5 text-blue-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 md:p-2"
                title="Record voice message"
              >
                <Mic className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            {/* Message input form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-1 items-end gap-1.5 md:gap-2"
            >
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Aa"
                  className={cn(
                    "w-full resize-none rounded-2xl border-0 bg-gray-100 px-3 py-2 text-sm leading-5 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none md:px-4 md:text-[15px]",
                    "max-h-[120px] min-h-[36px]"
                  )}
                  disabled={disabled || isSending}
                  rows={1}
                  style={{ paddingRight: "36px" }}
                />

                <button
                  type="button"
                  className="absolute right-1.5 bottom-2 rounded-full p-1 text-blue-600 hover:bg-gray-200 md:right-2"
                >
                  <Smile className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>

              {/* Send button */}
              {message.trim() ? (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() || disabled || isSending}
                  className={cn(
                    "mb-1 h-8 w-8 flex-shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 md:h-9 md:w-9",
                    isSending && "cursor-wait opacity-70"
                  )}
                >
                  <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              ) : (
                <button
                  type="button"
                  className="mb-1 rounded-full p-1.5 text-blue-600 hover:bg-gray-100 md:p-2"
                >
                  <Smile className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSend={handleSendVoice}
      />
    </>
  );
}
