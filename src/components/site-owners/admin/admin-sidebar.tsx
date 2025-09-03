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
  X,
  Edit3,
  Briefcase,
  Calendar,
  Globe,
  Bug,
  CreditCard,
  DollarSign,
  Truck,
  Phone,
  Gift,
  MessageSquare,
  Tag,
  User,
  Bot,
  Trophy,
  FolderOpen,
  GitBranch,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Subcategories", href: "/admin/subcategories", icon: GitBranch },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Order Management", href: "/admin/orders", icon: FileText },
  { name: "Inquiries", href: "/admin/contacts", icon: MessageSquare },
  { name: "Service Bookings", href: "/admin/service-bookings", icon: Calendar },
  { name: "Issues Tracking", href: "/admin/issues", icon: Bug },
  { name: "Offers and Discounts", href: "/admin/offers-discounts", icon: Gift },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "AI Chatbot Settings", href: "/admin/chatbot-settings", icon: Bot },
  { name: "Lucky Draw / Sales Fest", href: "/admin/lucky-draw", icon: Trophy },
  { name: "Popup", href: "/admin/popup", icon: Package },
  { name: "Settings", href: "/admin/settings/whatsapp", icon: Edit3 },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar - Sticky and Scrollable Version */}
      <div className="sticky top-0 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0 border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1 text-gray-400 hover:text-gray-500 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              {navigation.map(item => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-gray-50 text-gray-700"
                        : "text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                        isActive
                          ? "text-gray-600"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                  <span className="text-sm font-medium text-gray-600 capitalize">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-600 capitalize">
                  {user.name || "Admin"}
                </p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
