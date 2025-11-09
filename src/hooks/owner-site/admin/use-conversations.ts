import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
import {
  WebhookNewMessageEvent,
  SendMessageRequest,
} from "@/types/owner-site/admin/conversations";
import { toast } from "sonner";

const MESSAGES_QUERY_KEY = "conversation-messages";

// 🧩 Fetch conversation messages (with merge + localStorage sync)
export const useConversationMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();
  const isMounted = useRef(true);

  const loadFromLocalStorage = () => {
    if (!conversationId) return [];
    try {
      const data = localStorage.getItem(`messages_${conversationId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveToLocalStorage = (messages: unknown[]) => {
    if (!conversationId) return;
    localStorage.setItem(
      `messages_${conversationId}`,
      JSON.stringify(messages)
    );
  };

  const query = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    enabled: !!conversationId,
    staleTime: 5000,
    queryFn: async () => {
      const serverData = await useConversationsApi.getConversationMessages(
        conversationId!
      );
      const localData = loadFromLocalStorage();

      const serverMessages = serverData?.conversation?.messages ?? [];
      const mergedMessages = [
        ...serverMessages,
        ...localData.filter(
          (lm: any) => !serverMessages.some((sm: any) => sm.id === lm.id)
        ),
      ];

      saveToLocalStorage(mergedMessages);

      return {
        ...serverData,
        conversation: {
          ...serverData.conversation,
          messages: mergedMessages,
        },
      };
    },
  });

  // 🔄 Subscribe for live updates using SSE
  useEffect(() => {
    if (!conversationId) return;

    let eventSource: EventSource | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      // Close existing connection if any
      if (eventSource) {
        eventSource.close();
      }

      console.log(`🔌 Connecting to SSE for conversation: ${conversationId}`);
      eventSource = new EventSource(
        `/api/facebook/conversations/${conversationId}/messages`
      );

      eventSource.onopen = () => {
        console.log("✅ SSE connection established");
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      };

      eventSource.onmessage = event => {
        if (!isMounted.current) return;

        try {
          const data = JSON.parse(event.data);
          console.log("📩 Received message:", data.type);

          if (data.type === "initial") {
            // Handle initial messages
            queryClient.setQueryData(
              [MESSAGES_QUERY_KEY, conversationId],
              (old: any) => {
                if (!old) return old;
                const updatedMessages = [...(data.messages || [])];
                saveToLocalStorage(updatedMessages);
                return {
                  ...old,
                  conversation: {
                    ...old.conversation,
                    messages: updatedMessages,
                  },
                };
              }
            );
          } else if (data.type === "new") {
            // Handle new messages
            queryClient.setQueryData(
              [MESSAGES_QUERY_KEY, conversationId],
              (old: any) => {
                if (!old) return old;

                const newMessage = data.message;
                const exists = old.conversation.messages.some(
                  (m: any) => m.id === newMessage.id
                );

                if (exists) return old;

                const updatedMessages = [
                  ...old.conversation.messages,
                  newMessage,
                ];
                saveToLocalStorage(updatedMessages);

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
        } catch (error) {
          console.error("Error processing SSE message:", error);
        }
      };

      eventSource.onerror = error => {
        console.error("SSE connection error:", error);

        // Attempt to reconnect with exponential backoff
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

    // Initial connection
    connect();

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [conversationId, queryClient]);

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
          (old: any) => {
            if (!old) return old;

            const optimisticMessage = {
              id: `temp-${Date.now()}`,
              from: {
                id: newMessage.page_id, // ✅ this now matches `currentUserId`
                name: "You",
              },
              message: newMessage.message,
              created_time: new Date().toISOString(),
              isOptimistic: true,
            };

            const updated = {
              ...old,
              conversation: {
                ...old.conversation,
                messages: [...old.conversation.messages, optimisticMessage],
              },
            };

            localStorage.setItem(
              `messages_${newMessage.conversationId}`,
              JSON.stringify(updated.conversation.messages)
            );

            return updated;
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

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, variables.conversationId],
      });
    },
  });
};
