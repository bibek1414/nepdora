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
  Menu,
  X,
  PanelRight,
  ArrowLeftToLine,
} from "lucide-react";

const navigationGroups = [
  {
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    name: "Products & Services",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Services", href: "/admin/services", icon: Briefcase },
      {
        name: "Offers and Discounts",
        href: "/admin/offers-discounts",
        icon: Gift,
      },
    ],
  },
  {
    name: "Orders & Bookings",
    items: [
      { name: "Order Management", href: "/admin/orders", icon: FileText },
      {
        name: "Service Bookings",
        href: "/admin/service-bookings",
        icon: Calendar,
      },
    ],
  },
  {
    name: "Content Management",
    items: [
      { name: "Blogs", href: "/admin/blogs", icon: Globe },
      { name: "YouTube Videos", href: "/admin/youtube", icon: Youtube },
      { name: "Portfolios", href: "/admin/portfolio", icon: Briefcase },
      { name: "Banner", href: "/admin/banners", icon: Globe },
      { name: "Popup", href: "/admin/popup", icon: Package },
      { name: "Faq", href: "/admin/faq", icon: Tag },
      { name: "Testimonials", href: "/admin/testimonials", icon: Tag },
    ],
  },
  {
    name: "Submissions & Inquiries",
    items: [
      { name: "Inquiries", href: "/admin/contacts", icon: MessageSquare },
      {
        name: "Popup Inquiries",
        href: "/admin/popup-inquiries",
        icon: MessageSquare,
      },
      { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
    ],
  },
  {
    name: "Team & Users",
    items: [
      { name: "Team Members", href: "/admin/team-member", icon: Users },
      { name: "Profile", href: "/admin/profile", icon: User },
    ],
  },
  {
    name: "Marketing & Engagement",
    items: [
      {
        name: "Lucky Draw / Sales Fest",
        href: "/admin/lucky-draw",
        icon: Trophy,
      },
      {
        name: "AI Chatbot Settings",
        href: "/admin/chatbot-settings",
        icon: Bot,
      },
    ],
  },
  {
    name: "System",
    items: [
      { name: "Issues Tracking", href: "/admin/issues", icon: Bug },
      { name: "Settings", href: "/admin/settings/whatsapp", icon: Edit3 },
    ],
  },
];

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

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationGroups.forEach(group => {
      if (group.name) {
        initial[group.name] = true;
      }
    });
    return initial;
  });

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div
      className={cn(
        "sticky top-0 mt-15 h-screen border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header with Toggle Button */}
        <div className="flex-shrink-0 border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h2>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100",
                collapsed && "mx-auto"
              )}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelRight className="h-5 w-5 text-gray-600" />
              ) : (
                <PanelRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="scrollbar-hide flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-2">
            {navigationGroups.map((group, groupIndex) => (
              <div key={group.name || groupIndex}>
                {/* Group Header */}
                {group.name && !collapsed && (
                  <button
                    onClick={() => toggleGroup(group.name!)}
                    className="mb-2 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-semibold tracking-wider text-gray-500 uppercase transition-colors hover:bg-gray-50"
                  >
                    <span>{group.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openGroups[group.name] ? "rotate-0" : "-rotate-90"
                      )}
                    />
                  </button>
                )}

                {/* Divider for collapsed state */}
                {collapsed && groupIndex > 0 && (
                  <div className="my-2 border-t border-gray-200" />
                )}

                {/* Group Items */}
                <div
                  className={cn(
                    "space-y-1 transition-all duration-200",
                    !collapsed && group.name && !openGroups[group.name]
                      ? "hidden"
                      : "block"
                  )}
                >
                  {group.items.map(item => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        title={collapsed ? item.name : undefined}
                        className={cn(
                          "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                          collapsed ? "justify-center" : "",
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5 flex-shrink-0 transition-colors",
                            collapsed ? "mr-0" : "mr-3",
                            isActive
                              ? "text-gray-900"
                              : "text-gray-400 group-hover:text-gray-600"
                          )}
                        />
                        {!collapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-3 py-4">
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <span className="text-sm font-medium text-gray-600 capitalize">
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </span>
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-600 capitalize">
                  {user.name || "Admin"}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
