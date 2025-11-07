import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
import {
  WebhookNewMessageEvent,
  SendMessageRequest,
} from "@/types/owner-site/admin/conversations";
import { toast } from "sonner";

const MESSAGES_QUERY_KEY = "conversation-messages";

export const useConversationMessages = (conversationId: string | null) => {
  const queryClient = useQueryClient();

  const loadFromLocalStorage = () => {
    if (!conversationId) return [];
    const data = localStorage.getItem(`messages_${conversationId}`);
    return data ? JSON.parse(data) : [];
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveToLocalStorage = (messages: any[]) => {
    if (!conversationId) return;
    localStorage.setItem(
      `messages_${conversationId}`,
      JSON.stringify(messages)
    );
  };

  const query = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    queryFn: async () => {
      const serverData = await useConversationsApi.getConversationMessages(
        conversationId!
      );
      const localData = loadFromLocalStorage();

      // ✅ Merge unique messages
      const mergedMessages = [
        ...serverData.conversation.messages,
        ...localData.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (lm: any) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            !serverData.conversation.messages.some((sm: any) => sm.id === lm.id)
        ),
      ];

      saveToLocalStorage(mergedMessages);

      return {
        ...serverData,
        conversation: { ...serverData.conversation, messages: mergedMessages },
      };
    },
    enabled: !!conversationId,
    staleTime: 5000,
  });

  // 🔄 Real-time updates
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = useConversationsApi.subscribeToConversation(
      conversationId,
      (data: WebhookNewMessageEvent["data"]) => {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, conversationId],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (old: any) => {
            if (!old) return old;

            const newMessage = {
              id: data.message.id,
              from: data.message.from,
              message: data.message.message,
              created_time: data.timestamp,
            };

            const exists = old.conversation.messages.some(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (m: any) => m.id === newMessage.id
            );
            if (exists) return old;

            const updatedMessages = [...old.conversation.messages, newMessage];
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
    );

    return () => unsubscribe();
  }, [conversationId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const MESSAGES_QUERY_KEY = "conversation-messages";

  return useMutation({
    mutationFn: async (
      data: SendMessageRequest & { conversationId: string }
    ) => {
      return useConversationsApi.sendMessage(data);
    },
    onMutate: async newMessage => {
      // Optimistically update the UI
      await queryClient.cancelQueries({
        queryKey: [MESSAGES_QUERY_KEY, newMessage.conversationId],
      });

      const previousMessages = queryClient.getQueryData([
        MESSAGES_QUERY_KEY,
        newMessage.conversationId,
      ]);

      // Add the optimistic message to the cache
      if (previousMessages) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, newMessage.conversationId],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (old: any) => {
            if (!old) return old;

            const optimisticMessage = {
              id: `temp-${Date.now()}`,
              from: "admin",
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

      return { previousMessages };
    },
    onError: (error, variables, context) => {
      // Revert on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, variables.conversationId],
          context.previousMessages
        );
      }

      toast("Failed to send message");
    },
    onSettled: (data, error, variables) => {
      // Refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, variables.conversationId],
      });
    },
  });
};
