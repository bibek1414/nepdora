import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/config/site";

type WebSocketMessage = {
  action?: string;
  data?: any;
  error?: string;
  id?: string | number;
  slug?: string;
  [key: string]: any;
};

type UseWebsiteSocketProps = {
  schema_name: string;
  enabled?: boolean;
};

type ActionListener = (data: any) => void;

// Fallback: BroadcastChannel for same-origin cross-tab sync without SharedWorker
function getWsBaseUrl() {
  const baseUrl = getApiBaseUrl() || "https://nepdora.baliyoventures.com";
  return baseUrl.replace(/^http/, "ws");
}

export const useWebsiteSocket = ({
  schema_name,
  enabled = true,
}: UseWebsiteSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const listenersRef = useRef<Record<string, Set<ActionListener>>>({});

  // SharedWorker ref
  const workerRef = useRef<SharedWorker | null>(null);
  // Fallback: regular WebSocket
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const useSharedWorker = useRef(typeof SharedWorker !== "undefined");
  const messageQueueRef = useRef<WebSocketMessage[]>([]); // ← ADD

  const subscribe = useCallback((action: string, callback: ActionListener) => {
    if (!listenersRef.current[action]) {
      listenersRef.current[action] = new Set();
    }
    listenersRef.current[action].add(callback);
    return () => {
      listenersRef.current[action]?.delete(callback);
      if (listenersRef.current[action]?.size === 0) {
        delete listenersRef.current[action];
      }
    };
  }, []);
  const flushQueue = useCallback(() => {
    while (messageQueueRef.current.length > 0) {
      const msg = messageQueueRef.current.shift()!;
      if (useSharedWorker.current && workerRef.current) {
        workerRef.current.port.postMessage({
          type: "SEND",
          schema_name,
          message: msg,
        });
      } else {
        socketRef.current?.send(JSON.stringify(msg));
      }
    }
  }, [schema_name]);
  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      const { action, data, error, slug } = message;

      if (error) {
        toast.error(error);
        return;
      }

      if (action && listenersRef.current[action]) {
        listenersRef.current[action].forEach(cb => cb(message));
      }

      switch (action) {
        case "pages_list":
          queryClient.setQueryData(["pages"], data);
          break;
        case "page_created":
          queryClient.invalidateQueries({ queryKey: ["pages"] });
          if (data) queryClient.setQueryData(["pages", data.slug], data);
          break;
        case "page_updated":
          queryClient.invalidateQueries({ queryKey: ["pages"] });
          if (data) {
            queryClient.setQueryData(["pages", data.slug], data);
            queryClient.invalidateQueries({ queryKey: ["pages", data.slug] });
          }
          break;
        case "page_published":
        case "page_deleted":
          queryClient.invalidateQueries({ queryKey: ["pages"] });
          break;
        case "component_created":
        case "component_updated":
        case "component_replaced":
        case "component_deleted":
          queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
          if (data?.component_type) {
            queryClient.invalidateQueries({
              queryKey: ["pageComponents", "types", data.component_type],
            });
          }
          break;
        case "component_published":
          queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
          break;
        case "navbar":
          queryClient.setQueryData(["navbar"], {
            data,
            message: "Navbar retrieved",
          });
          break;
        case "navbar_created":
        case "navbar_updated":
        case "navbar_replaced":
        case "navbar_published":
          queryClient.invalidateQueries({ queryKey: ["navbar"] });
          if (data)
            queryClient.setQueryData(["navbar"], {
              data,
              message: "Navbar updated",
            });
          break;
        case "navbar_deleted":
          queryClient.setQueryData(["navbar"], null);
          queryClient.invalidateQueries({ queryKey: ["navbar"] });
          break;
        case "footer":
          queryClient.setQueryData(["footer"], {
            data,
            message: "Footer retrieved",
          });
          break;
        case "footer_created":
        case "footer_updated":
        case "footer_replaced":
        case "footer_published":
          queryClient.invalidateQueries({ queryKey: ["footer"] });
          if (data)
            queryClient.setQueryData(["footer"], {
              data,
              message: "Footer updated",
            });
          break;
        case "footer_deleted":
          queryClient.setQueryData(["footer"], null);
          queryClient.invalidateQueries({ queryKey: ["footer"] });
          break;
        case "themes_list":
          queryClient.setQueryData(["themes"], data);
          break;
        case "theme_updated":
        case "theme_published":
          queryClient.invalidateQueries({ queryKey: ["themes"] });
          break;
        case "site_config":
        case "site_config_updated":
          queryClient.setQueryData(["siteConfig"], data);
          break;
        case "ui_reset":
        case "all_published":
        case "template_imported":
          queryClient.invalidateQueries();
          break;
        default:
          console.warn("Unknown WebSocket action:", action);
      }
    },
    [queryClient]
  );

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (useSharedWorker.current && workerRef.current) {
        if (isConnected) {
          workerRef.current.port.postMessage({
            type: "SEND",
            schema_name,
            message,
          });
        } else {
          console.warn(
            "[Hook] Worker not connected, queuing message:",
            message.action
          );
          messageQueueRef.current.push(message);
        }
      } else if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(message));
      } else {
        // Queue it instead of failing immediately
        console.warn(
          "[Hook] WebSocket not ready, queuing message:",
          message.action
        );
        messageQueueRef.current.push(message);
      }
    },
    [isConnected, schema_name]
  );

  // --- SharedWorker path ---
  useEffect(() => {
    if (!enabled || !schema_name) return;
    if (!useSharedWorker.current) return;

    const worker = new SharedWorker("/websocket-worker.js");
    workerRef.current = worker;

    worker.port.onmessage = e => {
      const { type, data, error } = e.data;
      if (type === "CONNECTED") {
        setIsConnected(true);
        flushQueue();
      } else if (type === "DISCONNECTED") {
        setIsConnected(false);
      } else if (type === "MESSAGE") {
        try {
          const message: WebSocketMessage =
            typeof data === "string" ? JSON.parse(data) : data;
          handleMessage(message);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      } else if (type === "ERROR") {
        toast.error(error || "WebSocket error");
      }
    };

    worker.port.start();
    worker.port.postMessage({
      type: "CONNECT",
      schema_name,
      wsBaseUrl: getWsBaseUrl(),
    });

    return () => {
      worker.port.postMessage({ type: "DISCONNECT", schema_name });
      worker.port.close();
    };
  }, [enabled, schema_name, handleMessage]);

  const connect = useCallback(() => {
    if (!enabled || !schema_name || useSharedWorker.current) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) return;

    const baseUrl = getApiBaseUrl() || "https://nepdora.baliyoventures.com";
    const wsBaseUrl = baseUrl.replace(/^http/, "ws");
    const url = `${wsBaseUrl}/ws/website/${schema_name}/`;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
      flushQueue(); // ← FLUSH QUEUED MESSAGES
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
      if (enabled) {
        reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
      }
    };

    socket.onerror = () => setIsConnected(false);

    socket.onmessage = event => {
      try {
        handleMessage(JSON.parse(event.data));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }, [enabled, schema_name, flushQueue]);

  return { isConnected, sendMessage, subscribe };
};
