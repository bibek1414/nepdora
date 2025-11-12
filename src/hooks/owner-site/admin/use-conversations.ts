import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
import { SendMessageRequest } from "@/types/owner-site/admin/conversations";
import { toast } from "sonner";

const MESSAGES_QUERY_KEY = "conversation-messages";
const CONVERSATIONS_QUERY_KEY = "conversations";

// Hook to fetch conversation list (no WebSocket logic here)
export const useConversationList = (pageId: string | null) => {
  return useQuery({
    queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
    enabled: !!pageId,
    staleTime: 60000,
    refetchInterval: 300000,
    queryFn: async () => {
      if (!pageId) return [];
      const data = await useConversationsApi.getConversations(pageId);
      console.log(`📥 Fetched ${data?.length || 0} conversations from backend`);
      return data;
    },
  });
};

// Hook to fetch conversation messages (no WebSocket logic here)
export const useConversationMessages = (
  conversationId: string | null,
  pageId: string | null
) => {
  return useQuery({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    enabled: !!conversationId,
    staleTime: Infinity,
    queryFn: async () => {
      if (!conversationId) return null;
      return useConversationsApi.getConversationMessages(conversationId);
    },
  });
};

// Send message with optimistic update
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: SendMessageRequest & { conversationId: string; page_id: string }
    ) => {
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

      if (previous) {
        queryClient.setQueryData(
          [MESSAGES_QUERY_KEY, newMessage.conversationId],
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          (old: any) => {
            if (!old) return old;

            let optimisticAttachments = undefined;
            if (newMessage.fileUpload) {
              const file = newMessage.fileUpload as Blob;
              const fileType = file.type;
              let attachmentType = "file";

              if (fileType.startsWith("image/")) attachmentType = "image";
              else if (fileType.startsWith("audio/")) attachmentType = "audio";
              else if (fileType.startsWith("video/")) attachmentType = "video";

              const tempUrl = URL.createObjectURL(file);

              optimisticAttachments = [
                {
                  type: attachmentType,
                  url: tempUrl,
                  isOptimistic: true,
                },
              ];
            }

            const optimisticMessage = {
              id: `temp-${Date.now()}`,
              from: {
                id: newMessage.page_id,
                name: "You",
              },
              message: newMessage.message || "",
              created_time: new Date().toISOString(),
              isOptimistic: true,
              attachments: optimisticAttachments,
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

    onSuccess: () => {
      console.log("✅ Message sent successfully, waiting for WebSocket update");
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
