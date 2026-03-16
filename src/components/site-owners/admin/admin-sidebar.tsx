"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  Bug,
  MessageSquare,
  Mail,
  PanelRight,
  PanelLeft,
  MessageCircle,
  Wallet,
  Unplug,
  Facebook,
  LayoutPanelTop,
  Settings,
  Calendar,
  IndianRupee,
  Database,
  BookOpen,
  Users,
  History,
  BarChart3,
} from "lucide-react";
import { User } from "@/types/auth/auth";
import { useUnreadCounts } from "@/hooks/owner-site/admin/use-stats";

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  unreadCount?: number;
}

interface NavigationGroup {
  items: NavigationItem[];
  hideForService?: boolean;
  showForBatoma?: boolean;
}

interface AdminSidebarProps {
  user: User;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: unreadCounts } = useUnreadCounts();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const navigationGroups: NavigationGroup[] = [
    {
      items: [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      items: [
        { name: "Template", href: "/admin/template", icon: LayoutPanelTop },
      ],
    },
    {
      items: [{ name: "Products", href: "/admin/products", icon: Package }],
      hideForService: true,
    },
    {
      items: [
        {
          name: "Order Management",
          href: "/admin/orders",
          icon: FileText,
          unreadCount: unreadCounts?.unread_orders,
        },
      ],
      hideForService: true,
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
      items: [
        {
          name: "Inquiries",
          href: "/admin/inquiries",
          icon: Mail,
          unreadCount:
            (unreadCounts?.unread_contacts || 0) +
            (unreadCounts?.unread_popup_forms || 0) +
            (unreadCounts?.unread_newsletters || 0),
        },
      ],
    },
    {
      items: [
        {
          name: "Appointment",
          href: "/admin/appointments",
          icon: Calendar,
          unreadCount: unreadCounts?.unread_appointments,
        },
      ],
    },
    {
      items: [
        {
          name: "Bookings",
          href: "/admin/bookings",
          icon: BookOpen,
        },
      ],
      showForBatoma: true,
    },
    {
      items: [{ name: "Issues Tracking", href: "/admin/issues", icon: Bug }],
    },

    {
      items: [
        {
          name: "Payment Gateway",
          href: "/admin/plugins/payment-gateway/esewa",
          icon: Wallet,
        },
      ],
      hideForService: true,
    },
    {
      items: [
        {
          name: "Payment History",
          href: "/admin/payments",
          icon: History,
          unreadCount:
            (unreadCounts?.unread_own_payment || 0) +
            (unreadCounts?.unread_tenant_payments || 0),
        },
      ],
      hideForService: true,
    },
    {
      items: [
        {
          name: "Pricing",
          href: "/admin/pricing",
          icon: IndianRupee,
        },
      ],
    },
    {
      items: [{ name: "Plugins", href: "/admin/plugins", icon: Unplug }],
    },
    {
      items: [
        { name: "Collections", href: "/admin/collections", icon: Database },
      ],
    },
    {
      items: [{ name: "Customers", href: "/admin/customers", icon: Users }],
    },
    {
      items: [
        {
          name: "Settings",
          href: "/admin/settings/site-config",
          icon: Settings,
        },
      ],
    },
  ];

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const filteredNavigationGroups = navigationGroups.filter(group => {
    if (user.website_type === "service" && group.hideForService) {
      return false;
    }
    if (group.showForBatoma && user.sub_domain !== "batoma") {
      return false;
    }
    return true;
  });

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-50 flex h-screen flex-col border-r border-gray-100 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b border-gray-100 px-4">
        <div
          className={cn(
            "flex items-center gap-2 transition-all duration-300",
            collapsed ? "w-full justify-center" : "w-full"
          )}
        >
          {collapsed ? (
            <></>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center space-x-4">
                <div className="shrink-0 items-center">
                  <h1 className="text-xl font-bold text-[#003d79]">
                    Admin Panel
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>

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

      <div className="scrollbar-hide flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {filteredNavigationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
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
                          "h-4 w-4 shrink-0",
                          collapsed ? "mr-0" : "mr-2"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {item.unreadCount !== undefined &&
                        item.unreadCount > 0 && (
                          <div
                            className={cn(
                              "flex items-center justify-center rounded-full bg-[#003d79] text-[10px] text-white",
                              collapsed
                                ? "absolute top-1 right-1 h-2 w-2"
                                : "ml-auto h-5 min-w-[20px] px-1"
                            )}
                          >
                            {!collapsed && item.unreadCount}
                          </div>
                        )}
                    </Link>
                  );
                })}
              </div>
              {collapsed &&
                groupIndex > 0 &&
                groupIndex < filteredNavigationGroups.length - 1 && (
                  <div className="border-border my-2 border-t" />
                )}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-100 p-4">
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
            <span className="text-primary-foreground text-xs font-medium">
              {(user.name || user.store_name)?.charAt(0)?.toUpperCase() ||
                user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="truncate text-sm font-medium capitalize">
                {user.name || user.store_name || "Admin"}
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
