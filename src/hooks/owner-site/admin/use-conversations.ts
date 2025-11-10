import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConversationsApi } from "@/services/api/owner-sites/admin/conversations";
import { SendMessageRequest } from "@/types/owner-site/admin/conversations";
import { toast } from "sonner";

const MESSAGES_QUERY_KEY = "conversation-messages";

export const useConversationMessages = (
  conversationId: string | null,
  pageId: string | null
) => {
  const queryClient = useQueryClient();
  const isMounted = useRef(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  const conversationIdRef = useRef(conversationId);

  // Keep conversationId ref updated
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Fetch messages once from backend
  const query = useQuery({
    queryKey: [MESSAGES_QUERY_KEY, conversationId],
    enabled: !!conversationId,
    staleTime: Infinity,
    queryFn: async () => {
      if (!conversationId) return null;
      return useConversationsApi.getConversationMessages(conversationId);
    },
  });

  // 🔄 Subscribe for live updates using SSE
  useEffect(() => {
    if (!pageId) {
      console.log("⏸️ SSE: No pageId, skipping connection");
      return;
    }

    // Prevent duplicate connections during Fast Refresh
    if (eventSourceRef.current) {
      console.log("⏸️ SSE: Already connected, skipping");
      return;
    }

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      // Close existing connection
      if (eventSourceRef.current) {
        console.log("🔌 Closing existing SSE connection");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const sseUrl = `/api/facebook/messages/stream?pageId=${pageId}`;
      console.log(`🔌 Connecting to SSE: ${sseUrl}`);

      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log(`✅ SSE connection established for pageId: ${pageId}`);
        reconnectAttempts = 0;
      };

      eventSource.onmessage = event => {
        if (!isMounted.current) {
          console.log("⏸️ Component unmounted, ignoring SSE message");
          return;
        }

        try {
          const data = JSON.parse(event.data);
          console.log(`📩 [SSE] Received event:`, data.type);

          if (data.type === "connected") {
            console.log(`🔗 SSE connected for pageId: ${pageId}`);
            return;
          }

          if (data.type === "message_update") {
            const message = data.message;
            const currentConv = conversationIdRef.current;

            console.log(`📨 [SSE] Message update:`, {
              conversationId: message?.conversationId,
              messageId: message?.id,
              text: message?.message,
              currentConversation: currentConv,
              match: currentConv === message?.conversationId,
            });

            // ✅ ALWAYS update the cache, regardless of selected conversation
            // This ensures messages are there when user selects the conversation
            if (message?.conversationId) {
              queryClient.setQueryData(
                [MESSAGES_QUERY_KEY, message.conversationId],
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                (old: any) => {
                  // If no data exists yet, create initial structure
                  if (!old) {
                    console.log(
                      `📦 Creating new conversation data for ${message.conversationId}`
                    );
                    return {
                      conversation: {
                        conversation_id: message.conversationId,
                        messages: [
                          {
                            id: message.id,
                            from: message.from,
                            message: message.message,
                            created_time: message.created_time,
                            attachments: message.attachments || [],
                          },
                        ],
                      },
                    };
                  }

                  // Check if message already exists
                  const exists = old.conversation?.messages?.some(
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (m: any) => m.id === message.id
                  );

                  if (exists) {
                    console.log(`ℹ️ Message ${message.id} already exists`);
                    return old;
                  }

                  console.log(
                    `➕ Adding new message ${message.id} to conversation ${message.conversationId}`
                  );
                  
                  // Remove matching optimistic messages when real message arrives
                  // Match by: same sender AND (same text content OR within 5 seconds)
                  const messageTime = new Date(message.created_time).getTime();
                  const messagesWithoutOptimistic = (old.conversation?.messages || []).filter(
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (m: any) => {
                      // Keep non-optimistic messages
                      if (!m.isOptimistic || !m.id?.startsWith('temp-')) return true;
                      
                      // Remove if same sender and same content
                      if (m.from?.id === message.from?.id && m.message === message.message) {
                        console.log(`🗑️ Removing optimistic message: ${m.id}`);
                        return false;
                      }
                      
                      // Remove if same sender and within 5 seconds (for media messages without text)
                      const optimisticTime = new Date(m.created_time).getTime();
                      const timeDiff = Math.abs(messageTime - optimisticTime);
                      if (m.from?.id === message.from?.id && timeDiff < 5000) {
                        console.log(`🗑️ Removing optimistic message by time: ${m.id}`);
                        return false;
                      }
                      
                      return true;
                    }
                  );
                  
                  const updatedMessages = [
                    ...messagesWithoutOptimistic,
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

              // If this is the currently selected conversation, show a visual indicator
              if (currentConv === message.conversationId) {
                console.log(
                  `✅ Message added to currently viewed conversation`
                );
              } else {
                console.log(
                  `📬 Message cached for conversation ${message.conversationId}`
                );
              }
            }
          } else if (data.type === "conversation_update") {
            const update = data.update;
            console.log(`💬 [SSE] Conversation update:`, {
              conversationId: update?.conversationId,
              snippet: update?.snippet,
            });

            // Update conversation list
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            queryClient.setQueryData(["conversations", pageId], (old: any) => {
              if (!old || !Array.isArray(old)) {
                console.log("⚠️ No conversation list to update");
                return old;
              }
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              const updated = old.map((conv: any) => {
                if (conv.conversation_id === update.conversationId) {
                  console.log(
                    `✅ Updating conversation ${update.conversationId}`
                  );
                  return {
                    ...conv,
                    snippet: update.snippet || conv.snippet,
                    updated_time: update.updated_time || conv.updated_time,
                    message_type: update.message_type || conv.message_type,
                  };
                }
                return conv;
              });

              return updated;
            });
          }
        } catch (error) {
          console.error("❌ Error processing SSE message:", error);
        }
      };

      eventSource.onerror = error => {
        console.error("❌ SSE connection error:", error);

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log("🔌 SSE connection closed");
        }

        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(
            `🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`
          );

          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++;
            connect();
          }, delay);
        } else {
          console.error("❌ Max reconnection attempts reached");
          eventSource.close();
          eventSourceRef.current = null;
        }
      };
    };

    connect();

    return () => {
      console.log("🧹 Cleaning up SSE connection");
      isMounted.current = false;

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [pageId, queryClient]); // Removed conversationId from deps to prevent reconnections

  return query;
};

// 📨 Send message with optimistic update
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

            // Create optimistic attachment if file upload exists
            let optimisticAttachments = undefined;
            if (newMessage.fileUpload) {
              const file = newMessage.fileUpload as Blob;
              const fileType = file.type;
              let attachmentType = "file";
              
              if (fileType.startsWith("image/")) attachmentType = "image";
              else if (fileType.startsWith("audio/")) attachmentType = "audio";
              else if (fileType.startsWith("video/")) attachmentType = "video";

              // Create a temporary URL for preview
              const tempUrl = URL.createObjectURL(file);
              
              optimisticAttachments = [{
                type: attachmentType,
                url: tempUrl,
                isOptimistic: true,
              }];
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

    onSuccess: (data, variables) => {
      // Don't invalidate immediately - let SSE handle the update
      // The SSE will deliver the real message and replace the optimistic one
      // This prevents the message from disappearing after sending
      console.log("✅ Message sent successfully, waiting for SSE update");
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
