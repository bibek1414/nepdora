"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Globe,
  HelpCircle,
  Layout,
  PanelRight,
  PanelLeft,
  Users,
  Settings,
  Database,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { useAuthContext } from "@/components/super-admin/auth-wrapper";

const navigationGroups = [
  {
    title: "Main",
    items: [
      {
        name: "Dashboard",
        href: "/superadmin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Domains", href: "/superadmin/domains", icon: Globe },
      { name: "Templates", href: "/superadmin/template", icon: Layout },
      { name: "FAQ", href: "/superadmin/faq", icon: HelpCircle },
      { name: "Testimonials", href: "/superadmin/testimonial", icon: Shield },
    ],
  },
  {
    title: "System",
    items: [
      { name: "Users", href: "/superadmin/users", icon: Users },
      { name: "Database", href: "/superadmin/database", icon: Database },
      { name: "Settings", href: "/superadmin/settings", icon: Settings },
    ],
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Get email from context instead of fetching again
  const { adminEmail } = useAuthContext();

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-50 flex h-screen flex-col border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div
          className={cn(
            "flex items-center gap-2 transition-all duration-300",
            collapsed ? "w-full justify-center" : "w-full"
          )}
        >
          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <Image
                  src="/nepdora-logoo.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                />
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
        <nav className="grid gap-2 px-2">
          {navigationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {!collapsed && (
                <div className="mb-2 px-3 pt-2">
                  <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {group.title}
                  </h3>
                </div>
              )}

              {collapsed && groupIndex > 0 && (
                <div className="border-border my-2 border-t" />
              )}

              <div className="grid gap-1">
                {group.items.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        collapsed ? "justify-center" : "justify-start",
                        isActive
                          ? "bg-red-50 text-red-700"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          collapsed ? "mr-0" : "mr-3",
                          isActive ? "text-red-600" : ""
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
        </nav>
      </div>

      <div className="border-t p-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600">
            <span className="text-xs font-medium text-white">
              {adminEmail ? adminEmail.substring(0, 2).toUpperCase() : "SA"}
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="truncate text-sm font-medium">Super Admin</p>
              <p className="text-muted-foreground truncate text-xs">
                {adminEmail || "Loading..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
