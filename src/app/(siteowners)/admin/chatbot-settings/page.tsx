import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
import ChatbotSettingsClient from "./chatbot-settings-client";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Chatbot Settings",
    pageDescription:
      "Configure and customize your AI chatbot for {storeName}. Set personality, welcome messages, and monitor chat statistics.",
    pageRoute: "/admin/chatbot-settings",
  });
}

export default function ChatbotSettingsPage() {
  return <ChatbotSettingsClient />;
}
