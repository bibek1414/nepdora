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
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
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
      {/* Mobile menu button - positioned fixed for easy access */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="bg-opacity-75 fixed inset-0 z-40 bg-gray-600 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Admin Panel
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)} // Close sidebar on navigation for mobile
                  className={cn(
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive
                        ? "text-blue-500"
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
            <div className="text-xs text-gray-500">Admin Dashboard v1.0</div>
          </div>
        </div>
      </div>
    </>
  );
}
