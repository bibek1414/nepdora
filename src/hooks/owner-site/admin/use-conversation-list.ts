import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";

const CONVERSATIONS_QUERY_KEY = "conversations";

export const useConversationList = (pageId: string | null) => {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const isMounted = useRef(true);

  // Fetch conversation list from backend
  const query = useQuery({
    queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
    enabled: !!pageId,
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 300000, // Auto-refresh every 5 minutes for consistency
    queryFn: async () => {
      if (!pageId) return [];
      const data = await useConversationsApi.getConversations(pageId);
      console.log(`📥 Fetched ${data?.length || 0} conversations from backend`);
      return data;
    },
  });

  // Real-time SSE updates
  useEffect(() => {
    if (!pageId) return;
    if (eventSourceRef.current) return; // Prevent duplicates

    console.log(
      `🔌 Setting up SSE for conversation list updates (pageId: ${pageId})`
    );

    const eventSource = new EventSource(
      `/api/facebook/messages/stream?pageId=${pageId}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log(`✅ Conversation list SSE connected`);
    };

    eventSource.onmessage = event => {
      if (!isMounted.current) return;

      try {
        const data = JSON.parse(event.data);

        if (data.type === "conversation_update") {
          const update = data.update;
          console.log(`💬 Conversation update received:`, update);

          queryClient.setQueryData(
            [CONVERSATIONS_QUERY_KEY, pageId],
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (old: any[] | undefined) => {
              if (!old || !Array.isArray(old)) {
                console.log(
                  "⚠️ No conversation list exists, will fetch from backend"
                );
                // Trigger a refetch to get the full list including new conversation
                queryClient.invalidateQueries({
                  queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
                });
                return old;
              }

              // Check if conversation already exists
              const existingIndex = old.findIndex(
                conv => conv.conversation_id === update.conversationId
              );

              if (existingIndex >= 0) {
                // ✅ Update existing conversation
                console.log(
                  `✅ Updating existing conversation: ${update.conversationId}`
                );
                const updated = [...old];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  snippet: update.snippet || updated[existingIndex].snippet,
                  updated_time:
                    update.updated_time || updated[existingIndex].updated_time,
                  message_type: update.message_type || updated[existingIndex].message_type,
                };

                // Sort by updated_time (newest first)
                return updated.sort((a, b) => {
                  const timeA = new Date(a.updated_time || 0).getTime();
                  const timeB = new Date(b.updated_time || 0).getTime();
                  return timeB - timeA;
                });
              } else {
                // ✨ NEW CONVERSATION - Fetch from backend to get full details
                console.log(
                  `🆕 New conversation detected: ${update.conversationId}`
                );
                console.log(
                  `📡 Fetching full conversation details from backend...`
                );

                // Trigger a background refetch to get the complete conversation
                // This ensures we have all participant info, etc.
                queryClient.invalidateQueries({
                  queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
                });

                // Optimistically add a placeholder
                return [
                  {
                    id: Date.now(), // Temporary ID
                    page: parseInt(pageId),
                    page_name: "",
                    conversation_id: update.conversationId,
                    participants: [
                      {
                        id: update.sender_id,
                        name: update.sender_name,
                        email: "",
                      },
                    ],
                    snippet: update.snippet,
                    updated_time: update.updated_time,
                    message_type: update.message_type,
                  },
                  ...old,
                ];
              }
            }
          );
        }
      } catch (error) {
        console.error("❌ Error processing conversation update:", error);
      }
    };

    eventSource.onerror = () => {
      console.error("❌ Conversation list SSE error");
      eventSource.close();
      eventSourceRef.current = null;
    };

    return () => {
      console.log("🧹 Cleaning up conversation list SSE");
      isMounted.current = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [pageId, queryClient]);

  return query;
};
