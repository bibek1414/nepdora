"use client";

import React, { useEffect, useState } from "react";

export default function FacebookWebSocketPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    // ✅ Connect to WebSocket
    const socket = new WebSocket(
      "wss://nepdora.baliyoventures.com/ws/facebook/bibek-bhattarai/"
    );

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket");
      setStatus("✅ Connected to WebSocket");
    };

    socket.onmessage = event => {
      console.log("📩 Message:", event.data);
      setMessages(prev => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("❌ Disconnected");
      setStatus("❌ Disconnected");
    };

    socket.onerror = err => {
      console.error("⚠️ WebSocket Error:", err);
      setStatus("⚠️ WebSocket Error");
    };

    // Cleanup on unmount
    return () => socket.close();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-2xl font-bold">Facebook WebSocket Demo</h1>
        <div
          className={`mb-6 rounded-md p-3 text-sm ${
            status.includes("Connected")
              ? "bg-green-700"
              : status.includes("Error")
                ? "bg-red-700"
                : "bg-yellow-700"
          }`}
        >
          {status}
        </div>

        <div className="max-h-[70vh] space-y-2 overflow-y-auto rounded-xl bg-gray-800 p-4 font-mono text-sm shadow-inner">
          {messages.length === 0 ? (
            <p className="text-gray-400">Waiting for messages...</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className="rounded-md bg-gray-700/40 p-2 break-all whitespace-pre-wrap"
              >
                {msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
