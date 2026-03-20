import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface WebSocketMessage {
  type: "connected" | "new_message" | "conversation_update";
  data?: {
    conversation_id: string;
    message: {
      id: string;
      from: {
        id: string;
        name: string;
        email?: string;
      };
      message: string;
      created_time: string;
      attachments?: Array<{
        type?: string;
        url?: string;
      }>;
    };
    page_id: string;
    snippet: string;
    sender_name: string;
    sender_id: string;
    timestamp: string;
    message_type?: string;
  };
}

interface UseWebSocketMessagesOptions {
  subDomain: string;
  pageId: string | null;
  enabled?: boolean;
}

export const useWebSocketMessages = ({
  subDomain,
  pageId,
  enabled = true,
}: UseWebSocketMessagesOptions) => {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const MESSAGES_QUERY_KEY = "conversation-messages";
  const CONVERSATIONS_QUERY_KEY = "conversations";

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!isMountedRef.current) return;

      try {
        const wsData: WebSocketMessage = JSON.parse(event.data);
        console.log(`📩 [WebSocket] Received event:`, wsData.type);

        if (wsData.type === "connected") {
          console.log(`🔗 WebSocket connected for tenant: ${subDomain}`);
          return;
        }

        // Handle new_message type
        if (wsData.type === "new_message" && wsData.data) {
          const {
            conversation_id,
            message,
            page_id: messagPageId,
            snippet,
            sender_name,
            sender_id,
            message_type,
          } = wsData.data;

          // Only process messages for the currently selected page
          if (messagPageId !== pageId) {
            console.log(
              `⏸️ Ignoring message for different page: ${messagPageId}`
            );
            return;
          }

          console.log(`📨 [WebSocket] New message:`, {
            conversationId: conversation_id,
            messageId: message.id,
            text: message.message,
            pageId: messagPageId,
          });

          // Update messages cache for the specific conversation
          queryClient.setQueryData(
            [MESSAGES_QUERY_KEY, conversation_id],
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (old: any) => {
              if (!old) {
                console.log(
                  `📦 Creating new conversation data for ${conversation_id}`
                );
                return {
                  conversation: {
                    conversation_id: conversation_id,
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

              const exists = old.conversation?.messages?.some(
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                (m: any) => m.id === message.id
              );

              if (exists) {
                console.log(`ℹ️ Message ${message.id} already exists`);
                return old;
              }

              console.log(`➕ Adding new message ${message.id}`);

              // Remove matching optimistic messages
              const messageTime = new Date(message.created_time).getTime();
              const messagesWithoutOptimistic = (
                old.conversation?.messages || []
              )
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((m: any) => {
                  if (!m.isOptimistic || !m.id?.startsWith("temp-"))
                    return true;

                  if (
                    m.from?.id === message.from?.id &&
                    m.message === message.message
                  ) {
                    console.log(`🗑️ Removing optimistic message: ${m.id}`);
                    return false;
                  }

                  const optimisticTime = new Date(m.created_time).getTime();
                  const timeDiff = Math.abs(messageTime - optimisticTime);
                  if (m.from?.id === message.from?.id && timeDiff < 5000) {
                    console.log(
                      `🗑️ Removing optimistic message by time: ${m.id}`
                    );
                    return false;
                  }

                  return true;
                });

              return {
                ...old,
                conversation: {
                  ...old.conversation,
                  messages: [
                    ...messagesWithoutOptimistic,
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
          );

          // Update conversation list with new snippet
          queryClient.setQueryData(
            [CONVERSATIONS_QUERY_KEY, pageId],
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            (old: any) => {
              if (!old || !Array.isArray(old)) {
                console.log(
                  "⚠️ No conversation list exists, will fetch from backend"
                );
                queryClient.invalidateQueries({
                  queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
                });
                return old;
              }

              const existingIndex = old.findIndex(
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                (conv: any) => conv.conversation_id === conversation_id
              );

              if (existingIndex >= 0) {
                console.log(
                  `✅ Updating existing conversation: ${conversation_id}`
                );
                const updated = [...old];
                updated[existingIndex] = {
                  ...updated[existingIndex],
                  snippet: snippet,
                  updated_time: message.created_time,
                  message_type: message_type || "text",
                };

                // Sort by updated_time (newest first)
                return updated.sort((a, b) => {
                  const timeA = new Date(a.updated_time || 0).getTime();
                  const timeB = new Date(b.updated_time || 0).getTime();
                  return timeB - timeA;
                });
              } else {
                console.log(`🆕 New conversation detected: ${conversation_id}`);
                queryClient.invalidateQueries({
                  queryKey: [CONVERSATIONS_QUERY_KEY, pageId],
                });

                return [
                  {
                    id: Date.now(),
                    page: parseInt(pageId || "0"),
                    page_name: "",
                    conversation_id: conversation_id,
                    participants: [
                      {
                        id: sender_id,
                        name: sender_name,
                        email: message.from.email || "",
                        profile_pic: undefined,
                      },
                      {
                        id: messagPageId,
                        name: "Your Page",
                        email: "",
                      },
                    ],
                    snippet: snippet,
                    updated_time: message.created_time,
                    message_type: message_type || "text",
                  },
                  ...old,
                ];
              }
            }
          );
        }
      } catch (error) {
        console.error("❌ Error processing WebSocket message:", error);
      }
    },
    [queryClient, pageId, subDomain]
  );

  const connect = useCallback(() => {
    if (!enabled || !subDomain || !pageId) {
      console.log("⏸️ WebSocket: Connection disabled or missing params");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("⏸️ WebSocket: Already connected");
      return;
    }

    // Close existing connection
    if (wsRef.current) {
      console.log("🔌 Closing existing WebSocket connection");
      wsRef.current.close();
      wsRef.current = null;
    }

    const wsUrl = `wss://nepdora.baliyoventures.com/ws/facebook/${subDomain}/`;
    console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(
        `✅ WebSocket connection established for tenant: ${subDomain}`
      );
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = handleMessage;

    ws.onerror = error => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = event => {
      console.log(
        `🔌 WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`
      );
      wsRef.current = null;

      if (!isMountedRef.current) {
        console.log("⏸️ Component unmounted, not reconnecting");
        return;
      }

      if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = Math.min(
          1000 * Math.pow(2, reconnectAttemptsRef.current),
          30000
        );
        console.log(
          `🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`
        );

        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      } else {
        console.error("❌ Max reconnection attempts reached");
      }
    };
  }, [enabled, subDomain, pageId, handleMessage]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      isMountedRef.current = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect,
    reconnect: connect,
  };
};
