"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useWebsiteSocket } from "@/hooks/owner-site/use-website-socket";

type WebsiteSocketContextType = {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  subscribe: (action: string, callback: (data: any) => void) => () => void;
};

export const WebsiteSocketContext = createContext<
  WebsiteSocketContextType | undefined
>(undefined);

export const useWebsiteSocketContext = () => {
  const context = useContext(WebsiteSocketContext);
  if (!context) {
    throw new Error(
      "useWebsiteSocketContext must be used within a WebsiteSocketProvider"
    );
  }
  return context;
};

type WebsiteSocketProviderProps = {
  children: ReactNode;
  schema_name: string;
};

export const WebsiteSocketProvider: React.FC<WebsiteSocketProviderProps> = ({
  children,
  schema_name,
}) => {
  const { isConnected, sendMessage, subscribe } = useWebsiteSocket({
    schema_name,
  });

  return (
    <WebsiteSocketContext.Provider
      value={{ isConnected, sendMessage, subscribe }}
    >
      {children}
    </WebsiteSocketContext.Provider>
  );
};
