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
  Rocket,
  Settings,
  History,
  Layers,
  Component,
  User,
  Users,
  Grid
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./builder.css";

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
  const [query, setQuery] = useState("");

  const handleComponentClick = (componentId: string) => {
    onComponentClick?.(componentId);
  };

  const items: Item[] = [
    { id: "hero-sections", label: "Hero", icon: Crown, keywords: ["banner", "top section", "intro"] },
    { id: "products-sections", label: "Products", icon: Package, keywords: ["catalog", "shop", "cards", "grid"] },
    { id: "testimonials-sections", label: "Testimonials", icon: Quote, keywords: ["reviews", "clients", "quotes"] },
    { id: "categories-sections", label: "Category", icon: Tag, keywords: ["category", "taxonomy", "organization", "groups"] },
    { id: "faq-sections", label: "FAQ", icon: Info, keywords: ["questions", "answers", "help"] },
    { id: "contact-sections", label: "Contact", icon: Mail, keywords: ["form", "email", "phone"] },
    { id: "services-sections", label: "Services", icon: Menu, keywords: ["what we do", "features"] },
    { id: "blog-sections", label: "Blog grid", icon: FileText, keywords: ["articles", "posts", "news"] },
    { id: "banner-sections", label: "Banner", icon: ImageIcon, keywords: ["promotional", "slider"] },
    { id: "gallery-sections", label: "Gallery", icon: Grid, keywords: ["images", "photos", "pictures", "grid", "masonry"] },
    { id: "team-members-sections", label: "Team", icon: Users, keywords: ["employees", "staff", "team"] },
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
    <aside className="w-[180px] shrink-0 border-l bg-white flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b">
        <span className="text-[12px] font-bold text-builder-text-primary flex items-center gap-2">
          <Layers className="h-4 w-4 text-builder-accent" />
          Components
        </span>
        <span className="text-[10px] text-builder-text-muted font-medium uppercase tracking-tight">drag to add</span>
      </div>

      <div className="p-3 border-b">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-builder-text-muted transition-colors group-focus-within:text-builder-accent" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="h-8 pl-8 text-xs border-builder-border bg-builder-surface-2 focus-visible:ring-1 focus-visible:ring-builder-accent focus-visible:border-builder-accent transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide flex flex-col gap-1">
        {filtered.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            draggable="true"
            onClick={() => handleComponentClick(id)}
            className="flex items-center gap-2.5 p-2 rounded-builder-radius-md cursor-grab active:cursor-grabbing hover:bg-builder-surface-2 border border-transparent hover:border-builder-border group transition-all"
          >
            <div className="h-7 w-7 rounded-md bg-builder-surface-2 border border-builder-border flex items-center justify-center text-builder-text-muted group-hover:bg-builder-accent-subtle group-hover:text-builder-accent group-hover:border-builder-accent/20 transition-all">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[13px] font-medium text-builder-text-secondary group-hover:text-builder-text-primary truncate">{label}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-4 text-center">
            <p className="text-xs text-builder-text-muted italic">No results found</p>
          </div>
        )}
      </div>
    </aside>
  );
};
