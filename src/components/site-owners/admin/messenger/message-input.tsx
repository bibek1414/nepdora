"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus, Image as ImageIcon, Mic, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Error sending message:", error);
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

  return (
    <div className="sticky z-20 border-t border-gray-200 bg-white px-4 py-2">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        {/* Action Buttons */}
        <div className="flex gap-1 pb-2">
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Plus className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <ImageIcon className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-blue-600 hover:bg-gray-100">
            <Mic className="h-5 w-5" />
          </button>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex flex-1 items-end gap-2">
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Aa"
              className={cn(
                "w-full resize-none rounded-2xl border-0 bg-gray-100 px-4 py-2 text-[15px] leading-5 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none",
                "max-h-[120px] min-h-[36px]"
              )}
              disabled={disabled || isSending}
              rows={1}
              style={{ paddingRight: "40px" }}
            />

            {/* Emoji Button */}
            <button
              type="button"
              className="absolute right-2 bottom-2 rounded-full p-1 text-blue-600 hover:bg-gray-200"
            >
              <Smile className="h-5 w-5" />
            </button>
          </div>

          {/* Send Button */}
          {message.trim() ? (
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || disabled || isSending}
              className="mb-1 h-9 w-9 flex-shrink-0 rounded-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <button
              type="button"
              className="mb-1 rounded-full p-2 text-blue-600 hover:bg-gray-100"
            >
              <Smile className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
