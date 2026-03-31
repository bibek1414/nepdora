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
  {
    id: "account",
    title: "Account",
    description: "Manage your profile and security settings",
    path: "/admin/settings/account",
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
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your store configuration, branding, delivery, domains, and account security.
        </p>
      </div>

      <div className="mb-8 cursor-pointer">
        <SettingsTabs items={settingsItems} websiteType={user?.website_type} />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}
