"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, X, Edit3 } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/superadmin/dashboard", icon: LayoutDashboard },
  { name: "Domain", href: "/superadmin/domains", icon: Edit3 },
  { name: "FAQ", href: "/superadmin/faq", icon: Edit3 },
];

export default function Sidebar() {
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
              <img src="/fulllogo.svg" alt="Logo" className="h-8 w-auto" />
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
        </div>
      </div>
    </>
  );
}
