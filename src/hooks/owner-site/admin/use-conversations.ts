// hooks/owner-site/admin/use-conversations.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
import { SendMessageRequest } from "@/types/owner-site/admin/conversations";
import { toast } from "sonner";

const CONVERSATIONS_QUERY_KEY = "conversations";
const MESSAGES_QUERY_KEY = "conversation-messages";

// Hook to get conversations by page_id
export const useConversations = (pageId: string | null) => {
  return useQuery({
    queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
    queryFn: () => useConversationsApi.getConversations(pageId!),
    enabled: !!pageId,
    staleTime: 10_000, // 10 seconds
    refetchOnWindowFocus: true,
  });
};

// Hook to get conversation messages
export const useConversationMessages = (conversationId: string | null) => {
  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    queryFn: () => useConversationsApi.getConversationMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 5_000, // 5 seconds
    refetchOnWindowFocus: true,
  });
};

// Hook to send a message with proper context
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageRequest & { conversationId: string }) =>
      useConversationsApi.sendMessage(data),
    onMutate: async variables => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [MESSAGES_QUERY_KEY, variables.conversationId],
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData([
        MESSAGES_QUERY_KEY,
        variables.conversationId,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [MESSAGES_QUERY_KEY, variables.conversationId],
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) => {
          if (!old) return old;

          const optimisticMessage = {
            id: `temp-${Date.now()}`,
            from: {
              id: variables.page_access_token, // Temporary - will be replaced on refetch
              name: "You",
              profile_pic: "",
            },
            message: variables.message,
            created_time: new Date().toISOString(),
          };

          return {
            ...old,
            conversation: {
              ...old.conversation,
              messages: [
                ...(old.conversation.messages || []),
                optimisticMessage,
              ],
            },
          };
        }
      );

      return { previousMessages, conversationId: variables.conversationId };
    },
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, context.conversationId],
          context.previousMessages
        );
      }
      toast.error(error.message || "Failed to send message");
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch specific conversation messages
      queryClient.invalidateQueries({
        queryKey: [MESSAGES_QUERY_KEY, variables.conversationId],
      });

      // Invalidate conversations list to update snippet
      queryClient.invalidateQueries({
        queryKey: [CONVERSATIONS_QUERY_KEY],
      });

      toast.success("Message sent successfully");
    },
  });
};
