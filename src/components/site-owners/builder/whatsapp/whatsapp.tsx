"use client";

import React from "react";
import { WhatsAppButton } from "./whatsapp-button";
import { useWhatsApps } from "@/hooks/owner-site/admin/use-whatsapp";

export function WhatsApp() {
  const { data: whatsappConfigs, isLoading, error } = useWhatsApps();

  // Don't render anything while loading or if there's an error
  if (isLoading || error || !whatsappConfigs) {
    return null;
  }

  // Find the first enabled WhatsApp config
  const enabledConfig = whatsappConfigs.find(
    config => config.is_enabled === true
  );

  // Don't render if no enabled config found
  if (!enabledConfig) {
    return null;
  }

  return (
    <WhatsAppButton
      phoneNumber={enabledConfig.phone_number}
      message={
        enabledConfig.message ||
        "Hello! I'm interested in your products/services."
      }
    />
  );
}
