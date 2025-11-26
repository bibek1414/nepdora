import React from "react";
import SettingsTabs from "./setting-tabs";
import { getServerUser } from "@/hooks/use-jwt-server";
interface SettingItem {
  id: string;
  title: string;
  description: string;
  path: string;
  hideForService?: boolean;
}

const settingsItems: SettingItem[] = [
  {
    id: "site-config",
    title: "Site Configuration",
    description: "Configure site-config gateways and billing settings",
    path: "/admin/settings/site-config",
  },
  {
    id: "delivery-charge",
    title: "Delivery Charge",
    description: "Configure delivery-charge gateways and billing settings",
    path: "/admin/settings/delivery-charge",
    hideForService: true,
  },
  {
    id: "domains",
    title: "Domains",
    description: "Manage your domain settings and configurations",
    path: "/admin/settings/domains",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
  websiteType?: string;
}

export default async function SettingsLayout({
  children,
  websiteType,
}: SettingsLayoutProps) {
  const user = await getServerUser();
  return (
    <div className="mx-auto px-20 py-20">
      <div className="mb-3">
        <h1 className="px-2 text-2xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
      </div>

      <SettingsTabs items={settingsItems} websiteType={user?.websiteType} />

      <div className="mt-2">{children}</div>
    </div>
  );
}
