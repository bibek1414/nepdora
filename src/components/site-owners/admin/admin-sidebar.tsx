"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Edit3,
  Briefcase,
  Calendar,
  Globe,
  Bug,
  Gift,
  MessageSquare,
  Tag,
  User,
  Bot,
  Trophy,
  Mail,
  Youtube,
  ChevronDown,
  PanelRight,
  PanelLeft,
  MessageCircle,
  Wallet,
  Truck,
  Unplug,
} from "lucide-react";
import Image from "next/image";

interface User {
  id: number;
  email: string;
  name: string;
  storeName: string;
  role: string;
  phoneNumber: string;
  domain: string;
  subDomain: string;
  hasProfile: boolean;
  hasProfileCompleted: boolean;
  avatar: string;
}

interface AdminSidebarProps {
  user: User;
}

const navigationGroups = [
  {
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    items: [{ name: "Products", href: "/admin/products", icon: Package }],
  },
  {
    items: [
      { name: "Order Management", href: "/admin/orders", icon: FileText },
    ],
  },
  {
    items: [
      {
        name: "Content Management",
        href: "/admin/content-management",
        icon: MessageCircle,
      },
    ],
  },
  {
    items: [{ name: "Inquiries", href: "/admin/inquiries", icon: Mail }],
  },
  {
    items: [{ name: "Issues Tracking", href: "/admin/issues", icon: Bug }],
  },
  {
    items: [
      {
        name: "Settings",
        href: "/admin/settings/delivery-charge",
        icon: Edit3,
      },
    ],
  },
  {
    items: [
      {
        name: "Payment Gateway",
        href: "/admin/plugins/payment-gateway/esewa",
        icon: Wallet,
      },
    ],
  },
  {
    items: [{ name: "Plugins", href: "/admin/plugins", icon: Unplug }],
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-50 flex h-screen flex-col border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b px-4">
        <div
          className={cn(
            "flex items-center gap-2 transition-all duration-300",
            collapsed ? "w-full justify-center" : "w-full"
          )}
        >
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Image
                    src="/fulllogo.svg"
                    alt="Logo"
                    width={150}
                    height={40}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="mr-1 h-4 w-4 text-gray-600" />
          ) : (
            <PanelRight className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="scrollbar-hide flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Group Items */}
              <div className="grid gap-1">
                {group.items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                        collapsed ? "justify-center" : "justify-start",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground leading-tight"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          collapsed ? "mr-0" : "mr-2"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Divider for collapsed state */}
              {collapsed &&
                groupIndex > 0 &&
                groupIndex < navigationGroups.length - 1 && (
                  <div className="border-border my-2 border-t" />
                )}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-xs font-medium">
              {user.name?.charAt(0)?.toUpperCase() ||
                user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="truncate text-sm font-medium capitalize">
                {user.name || "Admin"}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
