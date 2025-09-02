"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  MessageSquare,
  Users,
  Settings,
  X,
  Menu,
  HelpCircle,
  BarChart2,
  Store,
  Zap,
  Shield,
} from "lucide-react";
const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Package },
  { name: "Subcategories", href: "/admin/subcategories", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Store Settings", href: "/admin/store-settings", icon: Store },
  { name: "Integrations", href: "/admin/integrations", icon: Zap },
  { name: "Security", href: "/admin/security", icon: Shield },
  { name: "Lucky Draw", href: "/admin/luckydraw", icon: Settings },
  { name: "Help & Support", href: "/admin/help", icon: HelpCircle },
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
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white px-5 py-16 shadow-lg"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-500 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-2 py-4">
            {navigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-200 text-gray-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-black"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t px-4 py-4">
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </div>
    </>
  );
}
