// public/websocket-worker.js

const connections = new Map(); // schema_name -> { socket, ports, wsBaseUrl }

self.onconnect = event => {
  const port = event.ports[0];

  port.onmessage = e => {
    const { type, schema_name, message, wsBaseUrl } = e.data;

    switch (type) {
      case "CONNECT": {
        if (!connections.has(schema_name)) {
          console.log(`[Worker] New schema connection: ${schema_name}`);
          connections.set(schema_name, {
            socket: null,
            ports: new Set(),
            wsBaseUrl: wsBaseUrl, // Store the URL for this schema
          });
        }

        const conn = connections.get(schema_name);
        conn.ports.add(port);

        // Update wsBaseUrl if provided
        if (wsBaseUrl) conn.wsBaseUrl = wsBaseUrl;

        // Store port's schema_name for cleanup
        port._schema_name = schema_name;

        if (!conn.socket || conn.socket.readyState > WebSocket.OPEN) {
          createSocket(schema_name, conn);
        } else {
          // Already connected, notify this port
          console.log(
            `[Worker] Port attached to existing connection for: ${schema_name}`
          );
          port.postMessage({ type: "CONNECTED" });
        }
        break;
      }

      case "SEND": {
        const conn = connections.get(schema_name);
        if (conn?.socket?.readyState === WebSocket.OPEN) {
          conn.socket.send(JSON.stringify(message));
        } else {
          console.warn(
            `[Worker] Cannot SEND, socket not OPEN for ${schema_name}. State: ${conn?.socket?.readyState}`
          );
          port.postMessage({ type: "ERROR", error: "Not connected" });
        }
        break;
      }

      case "DISCONNECT": {
        const conn = connections.get(schema_name);
        if (conn) {
          conn.ports.delete(port);
          console.log(
            `[Worker] Port detached from ${schema_name}. Remaining ports: ${conn.ports.size}`
          );
          if (conn.ports.size === 0) {
            console.log(
              `[Worker] Closing socket for ${schema_name} as no ports remain.`
            );
            conn.socket?.close();
            connections.delete(schema_name);
          }
        }
        break;
      }
    }
  };

  port.start();
};

function createSocket(schema_name, conn) {
  const wsBaseUrl = conn.wsBaseUrl || "wss://nepdora.baliyoventures.com";
  const url = `${wsBaseUrl}/ws/website/${schema_name}/`;

  console.log(`[Worker] Attempting connection to: ${url}`);

  try {
    const socket = new WebSocket(url);
    conn.socket = socket;

    socket.onopen = () => {
      console.log(`[Worker] WebSocket OPEN for: ${schema_name}`);
      broadcast(schema_name, { type: "CONNECTED" });
    };

    socket.onclose = () => {
      console.log(`[Worker] WebSocket CLOSED for: ${schema_name}`);
      broadcast(schema_name, { type: "DISCONNECTED" });

      // Reconnect if ports still exist after a delay
      setTimeout(() => {
        const c = connections.get(schema_name);
        if (c && c.ports.size > 0) {
          console.log(`[Worker] Reconnecting for: ${schema_name}`);
          createSocket(schema_name, c);
        }
      }, 3000);
    };

    socket.onerror = error => {
      console.error(`[Worker] WebSocket ERROR for: ${schema_name}`, error);
      broadcast(schema_name, {
        type: "ERROR",
        error: "WebSocket connection failed",
      });
    };

    socket.onmessage = event => {
      broadcast(schema_name, { type: "MESSAGE", data: event.data });
    };
  } catch (err) {
    console.error(
      `[Worker] Failed to create WebSocket for: ${schema_name}`,
      err
    );
    broadcast(schema_name, { type: "ERROR", error: err.message });
  }
}

function broadcast(schema_name, message) {
  const conn = connections.get(schema_name);
  if (!conn) return;

  conn.ports.forEach(port => {
    try {
      port.postMessage(message);
    } catch (err) {
      console.error(
        `[Worker] Failed to post message to port for ${schema_name}`,
        err
      );
      conn.ports.delete(port); // Cleanup broken ports
    }
  });
}
