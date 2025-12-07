"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  X,
  LayoutDashboard,
  Crown,
  Info,
  Menu,
  Package,
  Mail,
  Quote,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Tag,
  PanelLeft,
  PanelRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ComponentSidebarProps {
  siteUser: string;
  onComponentClick?: (componentId: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

type Item = {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  keywords?: string[];
};

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  siteUser,
  onComponentClick,
  collapsed = false,
  onCollapsedChange,
}) => {
  const [query, setQuery] = useState("");

  const handleComponentClick = (componentId: string) => {
    onComponentClick?.(componentId);
  };

  const items: Item[] = [
    {
      id: "page-templates",
      label: "Page Templates",
      icon: LayoutDashboard,
      keywords: ["template", "page", "preset", "quick"],
    },
    {
      id: "navbar",
      label: "Header",
      icon: LayoutDashboard,
      keywords: ["navigation", "menu", "top"],
    },
    {
      id: "footer",
      label: "Footer",
      icon: LayoutDashboard,
      keywords: ["bottom", "credits"],
    },
    {
      id: "hero-sections",
      label: "Hero Section",
      icon: Crown,
      keywords: ["banner", "top section", "intro"],
    },
    {
      id: "about-sections",
      label: "About Us",
      icon: Info,
      keywords: ["company", "who we are"],
    },
    {
      id: "services-sections",
      label: "Services",
      icon: Menu,
      keywords: ["what we do", "features"],
    },
    {
      id: "categories-sections",
      label: "Categories Display",
      icon: FolderOpen,
      keywords: ["category", "taxonomy", "organization", "groups"],
    },
    {
      id: "subcategories-sections",
      label: "SubCategories Display",
      icon: Tag,
      keywords: ["subcategory", "sub-category", "nested", "subgroups"],
    },
    {
      id: "products-sections",
      label: "Products Display",
      icon: Package,
      keywords: ["catalog", "shop", "cards", "grid"],
    },
    {
      id: "contact-sections",
      label: "Contact",
      icon: Mail,
      keywords: ["form", "email", "phone"],
    },
    {
      id: "team-members-sections",
      label: "Team Members",
      icon: Crown,
      keywords: ["employees", "staff", "team"],
    },
    {
      id: "gallery-sections",
      label: "Image Gallery",
      icon: ImageIcon,
      keywords: ["gallery", "images", "photos", "pictures", "grid", "masonry"],
    },
    {
      id: "testimonials-sections",
      label: "Testimonials",
      icon: Quote,
      keywords: ["reviews", "clients", "quotes"],
    },
    {
      id: "faq-sections",
      label: "FAQ",
      icon: Info,
      keywords: ["questions", "answers", "help"],
    },
    {
      id: "blog-sections",
      label: "Blog",
      icon: FileText,
      keywords: ["articles", "posts", "news"],
    },
    {
      id: "portfolio-sections",
      label: "Portfolio",
      icon: FolderOpen,
      keywords: ["projects", "work", "gallery"],
    },
    {
      id: "banner-sections",
      label: "Banner",
      icon: ImageIcon,
      keywords: ["banner", "slider", "carousel", "hero", "promotional"],
    },
    {
      id: "policies-sections",
      label: "Policies",
      icon: FileText,
      keywords: [
        "Return Policy",
        "Shipping Policy",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
    {
      id: "text-editor-sections",
      label: "Text Editor",
      icon: FileText,
      keywords: ["Text Editor", "Editor", "Rich Text Editor", "WYSIWYG Editor"],
    },
    {
      id: "newsletter-sections",
      label: "Newsletter",
      icon: Mail,
      keywords: ["subscribe", "email", "form"],
    },
    {
      id: "youtube-sections",
      label: "YouTube Videos",
      icon: ImageIcon,
      keywords: ["video", "player", "embed", "youtube"],
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(({ label, id, keywords }) => {
      const haystack = [label, id, ...(keywords ?? [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

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
                    src="/nepdora-logoo.svg"
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
          onClick={() => onCollapsedChange?.(!collapsed)}
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

      {/* Search Bar */}
      {!collapsed && (
        <div className="border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search components…"
              aria-label="Search components"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && filtered.length > 0) {
                  handleComponentClick(filtered[0].id);
                }
              }}
              className="h-9 w-full rounded-md border-gray-200 bg-gray-50 pr-9 pl-9 text-sm placeholder:text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Component List */}
      <div className="scrollbar-hide flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {filtered.length === 0
            ? !collapsed && (
                <div className="px-3 py-3 text-sm text-gray-400">
                  No matches
                </div>
              )
            : filtered.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() => handleComponentClick(id)}
                  className={cn(
                    "group hover:bg-accent hover:text-accent-foreground flex h-auto items-center rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-colors",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      collapsed ? "mr-0" : "mr-2"
                    )}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Button>
              ))}
        </nav>
      </div>
    </div>
  );
};
