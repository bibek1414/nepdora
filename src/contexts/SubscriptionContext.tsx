"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSubscriptionStatus } from "@/hooks/use-subscription";
import type { SubscriptionStatus } from "@/types/subscription";

interface SubscriptionContextType {
  subscription: SubscriptionStatus | undefined;
  isActive: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, refetch } = useSubscriptionStatus();

  const value: SubscriptionContextType = {
    subscription: data,
    isActive: data?.active ?? false,
    isLoading,
    isError,
    refetch,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}

// Higher-order component to protect routes
export function withSubscription<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const { isActive } = useSubscription();

    if (!isActive) {
      return null; // The SubscriptionBlocker will handle showing the dialog
    }

    return <Component {...props} />;
  };
}
