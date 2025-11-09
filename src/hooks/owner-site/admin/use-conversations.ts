import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
import { SendMessageRequest } from "@/types/owner-site/admin/conversations";
import { toast } from "sonner";

const MESSAGES_QUERY_KEY = "conversation-messages";

// 🧩 Fetch conversation messages once from backend
export const useConversationMessages = (
  conversationId: string | null,
  pageId: string | null
) => {
  const queryClient = useQueryClient();
  const isMounted = useRef(true);

  // Fetch messages once from backend
  const query = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    enabled: !!conversationId,
    staleTime: Infinity, // Don't refetch automatically
    queryFn: async () => {
      if (!conversationId) return null;
      return useConversationsApi.getConversationMessages(conversationId);
    },
  });

  // 🔄 Subscribe for live updates using SSE (based on pageId, not conversationId)
  useEffect(() => {
    if (!pageId) return;

    let eventSource: EventSource | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      if (eventSource) {
        eventSource.close();
      }

      console.log(`🔌 Connecting to SSE for pageId: ${pageId}`);
      eventSource = new EventSource(
        `/api/facebook/messages/stream?pageId=${pageId}`
      );

      eventSource.onopen = () => {
        console.log("✅ SSE connection established for pageId:", pageId);
        reconnectAttempts = 0;
      };

      eventSource.onmessage = event => {
        if (!isMounted.current) return;

        try {
          const data = JSON.parse(event.data);
          console.log("📩 [SSE Update] Received update:", data.type);

          if (data.type === "message_update") {
            const message = data.message;
            console.log("📨 Message update:", {
              conversationId: message?.conversationId,
              messageId: message?.id,
              from: message?.from,
              message: message?.message,
            });

            // Optimistically update messages if this conversation is currently selected
            if (
              message?.conversationId &&
              conversationId === message.conversationId
            ) {
              queryClient.setQueryData(
                [MESSAGES_QUERY_KEY, conversationId],
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (old: any) => {
                  if (!old) return old;

                  // Check if message already exists
                  const exists = old.conversation?.messages?.some(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (m: any) => m.id === message.id
                  );
                  if (exists) return old;

                  // Add new message
                  const updatedMessages = [
                    ...(old.conversation?.messages || []),
                    {
                      id: message.id,
                      from: message.from,
                      message: message.message,
                      created_time: message.created_time,
                      attachments: message.attachments || [],
                    },
                  ];

                  return {
                    ...old,
                    conversation: {
                      ...old.conversation,
                      messages: updatedMessages,
                    },
                  };
                }
              );
            }
          } else if (data.type === "conversation_update") {
            const update = data.update;
            console.log("💬 Conversation update:", {
              conversationId: update?.conversationId,
              snippet: update?.snippet,
              updated_time: update?.updated_time,
            });

            // Optimistically update conversation list
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(["conversations", pageId], (old: any) => {
              if (!old || !Array.isArray(old)) return old;

              // Update the conversation and move it to top (will be sorted by updated_time)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const updated = old.map((conv: any) => {
                if (conv.conversation_id === update.conversationId) {
                  return {
                    ...conv,
                    snippet: update.snippet || conv.snippet,
                    updated_time: update.updated_time || conv.updated_time,
                  };
                }
                return conv;
              });

              // Sort by updated_time (newest first) - conversation-list will handle this via useMemo
              return updated;
            });
          }
        } catch (error) {
          console.error("Error processing SSE message:", error);
        }
      };

      eventSource.onerror = error => {
        console.error("SSE connection error:", error);

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(`Reconnecting in ${delay}ms...`);

          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            connect();
          }, delay);
        } else {
          console.error("Max reconnection attempts reached");
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
        }
      };
    };

    connect();

    return () => {
      isMounted.current = false;
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [pageId, conversationId, queryClient]);

  return query;
};

// 📨 Send message with optimistic update (fixed)
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: SendMessageRequest & { conversationId: string; page_id: string }
    ) => {
      // page_id now passed from MessagingPage
      return useConversationsApi.sendMessage(data);
    },

    onMutate: async newMessage => {
      await queryClient.cancelQueries({
        queryKey: [MESSAGES_QUERY_KEY, newMessage.conversationId],
      });

      const previous = queryClient.getQueryData([
        MESSAGES_QUERY_KEY,
        newMessage.conversationId,
      ]);

      // ✅ Add optimistic message
      if (previous) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, newMessage.conversationId],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (old: any) => {
            if (!old) return old;

            const optimisticMessage = {
              id: `temp-${Date.now()}`,
              from: {
                id: newMessage.page_id,
                name: "You",
              },
              message: newMessage.message,
              created_time: new Date().toISOString(),
              isOptimistic: true,
            };

            return {
              ...old,
              conversation: {
                ...old.conversation,
                messages: [...old.conversation.messages, optimisticMessage],
              },
            };
          }
        );
      }

      return { previous };
    },

    onError: (_error, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, variables.conversationId],
          context.previous
        );
      }
      toast.error("Failed to send message");
    },
  });
};
