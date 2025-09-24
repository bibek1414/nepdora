"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  DollarSign,
  FileText,
  Image as ImageIcon,
  FolderOpen,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ComponentSidebarProps {
  siteUser: string;
  onComponentClick?: (componentId: string) => void;
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
}) => {
  const router = useRouter();
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
      id: "pricing-sections",
      label: "Pricing",
      icon: DollarSign,
      keywords: ["plans", "packages", "subscription"],
    },
    {
      id: "blog-sections",
      label: "Blog",
      icon: FileText,
      keywords: ["articles", "posts", "news"],
    },
    {
      id: "gallery-sections",
      label: "Gallery",
      icon: ImageIcon,
      keywords: ["images", "photos", "portfolio"],
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
    <div className="sticky top-15 left-0 z-20 h-screen w-40 border-r bg-white">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="px-2 py-2">
          <h2 className="text-lg font-semibold text-gray-900">Components</h2>
        </div>

        {/* Search Bar */}
        <div className="px-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 z-10 h-3 w-4 -translate-y-1/2 text-gray-400" />
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
              className="mb-2 h-2 w-full rounded-md border-gray-200 bg-gray-50 pr-9 pl-8 text-[8px] placeholder:text-[8px] placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-400" />
              </Button>
            )}
          </div>
        </div>

        {/* Component Sections */}
        <div className="flex-1 overflow-y-auto text-gray-600">
          <div className="space-y-1 px-2">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-400">No matches</div>
            ) : (
              filtered.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant="ghost"
                  onClick={() => handleComponentClick(id)}
                  className="flex h-auto w-full items-center justify-start gap-3 px-3 py-1 text-left text-[9px] font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Icon className="h-2 w-2 text-gray-700" />
                  <span>{label}</span>
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
