"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Clock,
  LayoutDashboard,
  BarChart3,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  LayoutGrid,
  Lock,
  MessageSquare,
  Database,
  Users,
  MessageCircle,
  Bug,
  Mail,
  Zap,
  Ticket,
  Settings,
  User as UserIcon,
  Video,
  PenTool,
  ClipboardList,
  Gift,
  Facebook,
  HelpCircle,
  Monitor,
  Package,
  Layers,
  ChevronRight,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "@/types/auth/auth";

const RECENT_SEARCHES_KEY = "nepdora-admin-recent-searches";

interface SearchItem {
  id: string;
  title: string;
  url: string;
  group: string;
  icon?: any;
  keywords?: string[];
}

interface AdminGlobalSearchProps {
  user: User;
}

export function AdminGlobalSearch({ user }: AdminGlobalSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isMac, setIsMac] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<SearchItem[]>([]);

  const router = useRouter();

  // Comprehensive list of all admin pages
  const allPages: SearchItem[] = React.useMemo(
    () =>
      [
        {
          id: "dashboard",
          title: "Dashboard",
          url: "/admin/dashboard",
          group: "General",
          icon: LayoutDashboard,
          keywords: ["dashboard", "home", "stats", "overview"],
        },
        {
          id: "analytics",
          title: "Analytics",
          url: "/admin/analytics",
          group: "Reports",
          icon: BarChart3,
          keywords: ["analytics", "stats", "data", "charts", "revenue"],
        },
        {
          id: "appointments",
          title: "Appointments",
          url: "/admin/appointments",
          group: "Management",
          icon: Calendar,
          keywords: ["appointments", "booking", "schedule"],
        },
        {
          id: "blogs",
          title: "Blogs",
          url: "/admin/blogs",
          group: "Content",
          icon: BookOpen,
          keywords: ["blogs", "posts", "articles", "news"],
        },
        {
          id: "categories",
          title: "Categories",
          url: "/admin/categories",
          group: "Catalog",
          icon: LayoutGrid,
          keywords: ["categories", "products", "groups"],
        },
        {
          id: "change-password",
          title: "Change Password",
          url: "/admin/change-password",
          group: "Account",
          icon: Lock,
          keywords: ["change password", "security", "auth"],
        },
        {
          id: "collections",
          title: "Collections",
          url: "/admin/collections",
          group: "Catalog",
          icon: Database,
          keywords: ["collections", "groups", "products", "sets"],
        },
        {
          id: "contacts",
          title: "Contacts",
          url: "/admin/contacts",
          group: "Inquiries",
          icon: Users,
          keywords: ["contacts", "users", "leads"],
        },
        {
          id: "content-management",
          title: "Content Management",
          url: "/admin/content-management",
          group: "Content",
          icon: PenTool,
          keywords: ["content management", "cms", "pages"],
        },
        {
          id: "customers",
          title: "Customers",
          url: "/admin/customers",
          group: "Management",
          icon: Users,
          keywords: ["customers", "users", "clients"],
        },
        {
          id: "faq",
          title: "FAQ",
          url: "/admin/faq",
          group: "Content",
          icon: HelpCircle,
          keywords: ["faq", "questions", "support"],
        },
        {
          id: "inquiries",
          title: "Inquiries",
          url: "/admin/inquiries",
          group: "Management",
          icon: Mail,
          keywords: ["inquiries", "leads", "messages", "contact"],
        },
        {
          id: "issues",
          title: "Issues Tracking",
          url: "/admin/issues",
          group: "System",
          icon: Bug,
          keywords: ["issues", "bugs", "errors", "tickets"],
        },

        {
          id: "newsletter",
          title: "Newsletter",
          url: "/admin/newsletter",
          group: "Marketing",
          icon: Mail,
          keywords: ["newsletter", "emails", "subscribers"],
        },

        {
          id: "orders",
          title: "Orders",
          url: "/admin/orders",
          group: "Management",
          icon: ClipboardList,
          keywords: ["orders", "sales", "transactions"],
        },
        {
          id: "our-clients",
          title: "Our Clients",
          url: "/admin/our-clients",
          group: "Content",
          icon: Users,
          keywords: ["our clients", "customers", "partners"],
        },
        {
          id: "payments",
          title: "Payments",
          url: "/admin/payments",
          group: "System",
          icon: Zap,
          keywords: ["payments", "billing", "finance"],
        },
        {
          id: "plugins",
          title: "Plugins Management",
          url: "/admin/plugins",
          group: "System",
          icon: LayoutGrid,
          keywords: ["plugins", "extensions", "addons", "integrations"],
        },
        {
          id: "esewa",
          title: "eSewa",
          url: "/admin/plugins/payment-gateway/esewa",
          group: "Payment Gateway",
          icon: Zap,
          keywords: ["esewa", "payment", "gateway", "digital wallet"],
        },
        {
          id: "khalti",
          title: "Khalti",
          url: "/admin/plugins/payment-gateway/khalti",
          group: "Payment Gateway",
          icon: Zap,
          keywords: ["khalti", "payment", "gateway", "digital wallet"],
        },
        {
          id: "whatsapp",
          title: "WhatsApp",
          url: "/admin/plugins",
          group: "Plugins",
          icon: MessageCircle,
          keywords: ["whatsapp", "chat", "support", "plugin"],
        },
        {
          id: "dash-logistics",
          title: "Dash Logistics",
          url: "/admin/plugins",
          group: "Plugins",
          icon: Package,
          keywords: ["dash", "logistics", "shipping", "delivery", "plugin"],
        },
        {
          id: "ydm",
          title: "YDM",
          url: "/admin/plugins",
          group: "Plugins",
          icon: Layers,
          keywords: ["ydm", "plugin", "mapping", "utility"],
        },
        {
          id: "google-analytics",
          title: "Google Analytics",
          url: "/admin/plugins",
          group: "Plugins",
          icon: BarChart3,
          keywords: [
            "google",
            "analytics",
            "tracking",
            "stats",
            "seo",
            "plugin",
          ],
        },
        {
          id: "popup",
          title: "Popup",
          url: "/admin/popup",
          group: "Marketing",
          icon: Monitor,
          keywords: ["popup", "modal", "notices", "popups", "popi", "pop"],
        },
        {
          id: "popup-inquiries",
          title: "Popup Inquiries",
          url: "/admin/popup-inquiries",
          group: "Inquiries",
          icon: Mail,
          keywords: ["popup inquiries", "leads", "forms", "popi"],
        },
        {
          id: "portfolio",
          title: "Portfolio",
          url: "/admin/portfolio",
          group: "Content",
          icon: ImageIcon,
          keywords: ["portfolio", "projects", "gallery"],
        },
        {
          id: "pricing",
          title: "Pricing",
          url: "/admin/pricing",
          group: "System",
          icon: Zap,
          keywords: ["pricing", "plans", "subscription"],
        },
        {
          id: "products",
          title: "Products",
          url: "/admin/products",
          group: "Catalog",
          icon: Package,
          keywords: ["products", "items", "inventory"],
        },
        {
          id: "profile",
          title: "Profile",
          url: "/admin/profile",
          group: "Account",
          icon: UserIcon,
          keywords: ["profile", "me", "settings"],
        },
        {
          id: "promo-code",
          title: "Promo Code",
          url: "/admin/promo-code",
          group: "Marketing",
          icon: Ticket,
          keywords: ["promo code", "coupons", "discounts"],
        },
        {
          id: "service-bookings",
          title: "Service Bookings",
          url: "/admin/service-bookings",
          group: "Management",
          icon: ClipboardList,
          keywords: ["service bookings", "appointments"],
        },
        {
          id: "services",
          title: "Services",
          url: "/admin/services",
          group: "Catalog",
          icon: LayoutGrid,
          keywords: ["services", "offerings"],
        },
        {
          id: "settings",
          title: "Settings Management",
          url: "/admin/settings",
          group: "General",
          icon: Settings,
          keywords: ["settings", "configuration", "site"],
        },
        {
          id: "site-config",
          title: "Site Configuration",
          url: "/admin/settings/site-config",
          group: "Settings",
          icon: Settings,
          keywords: [
            "site config",
            "configuration",
            "site conigs",
            "branding",
            "settings",
          ],
        },
        {
          id: "delivery-charge",
          title: "Delivery Charges",
          url: "/admin/settings/delivery-charge",
          group: "Settings",
          icon: Zap,
          keywords: [
            "delivery charge",
            "shipping",
            "delivery chagee",
            "fees",
            "settings",
          ],
        },
        {
          id: "domains",
          title: "Domains",
          url: "/admin/settings/domains",
          group: "Settings",
          icon: Monitor,
          keywords: ["domains", "custom domain", "dns", "dominas", "settings"],
        },
        {
          id: "subcategories",
          title: "Subcategories",
          url: "/admin/subcategories",
          group: "Catalog",
          icon: Layers,
          keywords: ["subcategories", "groups", "nested"],
        },
        {
          id: "team-member",
          title: "Team Member",
          url: "/admin/team-member",
          group: "Management",
          icon: Users,
          keywords: ["team member", "staff", "employees"],
        },
        {
          id: "template",
          title: "Template",
          url: "/admin/template",
          group: "Content",
          icon: LayoutGrid,
          keywords: ["template", "design", "layout"],
        },
        {
          id: "testimonials",
          title: "Testimonials",
          url: "/admin/testimonials",
          group: "Content",
          icon: MessageSquare,
          keywords: ["testimonials", "reviews", "feedback"],
        },
        {
          id: "videos",
          title: "Videos",
          url: "/admin/videos",
          group: "Content",
          icon: Video,
          keywords: ["videos", "media", "youtube"],
        },
      ].filter(item => {
        // Filter based on website type (ecommerce vs service)
        if (user.website_type === "service") {
          const ecommerceOnly = [
            "products",
            "orders",
            "analytics",
            "categories",
            "subcategories",
            "collections",
            "promo-code",
            "payments",
            "esewa",
            "khalti",
          ];
          if (ecommerceOnly.includes(item.id)) return false;
        }

        if (user.website_type === "ecommerce") {
          const serviceOnly = [
            "services",
            "service-bookings",
            "appointments",
            "pricing",
          ];
          if (serviceOnly.includes(item.id)) return false;
        }

        return true;
      }),
    [user]
  );

  // Load recent searches from local storage
  React.useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  React.useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes("mac"));

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Reset search when dialog opens
  React.useEffect(() => {
    if (open) {
      setSearch("");
    }
  }, [open]);

  const filteredItems = React.useMemo(() => {
    if (!search) return [];
    const lowerSearch = search.toLowerCase();
    return allPages.filter(item => {
      const title = item.title.toLowerCase();
      const group = item.group.toLowerCase();
      const kws = item.keywords?.map(k => k.toLowerCase()) || [];

      // Exact include matches
      if (
        title.includes(lowerSearch) ||
        group.includes(lowerSearch) ||
        kws.some(k => k.includes(lowerSearch))
      ) {
        return true;
      }

      // Simple fuzzy match: check if all characters in search appear in order in title/keywords
      const fuzzyMatch = (text: string, query: string) => {
        let i = 0,
          j = 0;
        while (i < text.length && j < query.length) {
          if (text[i] === query[j]) j++;
          i++;
        }
        return j === query.length;
      };

      if (
        fuzzyMatch(title, lowerSearch) ||
        kws.some(k => fuzzyMatch(k, lowerSearch))
      ) {
        return true;
      }

      return false;
    });
  }, [search, allPages]);

  const addToRecent = React.useCallback((item: SearchItem) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      const updated = [item, ...filtered].slice(0, 5);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const runCommand = React.useCallback(
    (item: SearchItem) => {
      setOpen(false);
      addToRecent(item);
      router.push(item.url);
    },
    [router, addToRecent]
  );

  // Group filtered items by group
  const groupedItems = React.useMemo(() => {
    const groups: { [key: string]: SearchItem[] } = {};
    filteredItems.forEach(item => {
      if (!groups[item.group]) {
        groups[item.group] = [];
      }
      groups[item.group].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "text-muted-foreground relative h-9 w-64 justify-start rounded-full border-gray-200 bg-gray-50 pr-12 text-sm font-normal shadow-none transition-all hover:bg-gray-100"
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="inline-flex">Search admin pages...</span>
        <kbd className="pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">{isMac ? "⌘" : "Ctrl"}</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <CommandInput
          placeholder="Type to search for a page..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[80vh] sm:max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Recent Searches - Only show when search is empty */}
          {!search && recentSearches.length > 0 && (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map(item => (
                <CommandItem
                  key={`recent-${item.id}`}
                  onSelect={() => runCommand(item)}
                  className="cursor-pointer"
                >
                  <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                  <span className="text-muted-foreground ml-auto text-[10px] tracking-widest uppercase">
                    {item.group}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* All Pages (when search is empty) */}
          {!search && (
            <CommandGroup heading="Quick Access">
              {allPages.slice(0, 8).map(item => (
                <CommandItem
                  key={`quick-${item.id}`}
                  onSelect={() => runCommand(item)}
                  className="cursor-pointer"
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search Results */}
          {Object.entries(groupedItems).map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map(item => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(item)}
                  className="cursor-pointer"
                >
                  {item.icon && (
                    <item.icon className="mr-2 h-4 w-4 cursor-pointer" />
                  )}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
