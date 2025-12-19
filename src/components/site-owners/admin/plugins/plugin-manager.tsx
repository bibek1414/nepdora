"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, X, Search, Settings } from "lucide-react";
import { Plugin } from "@/types/plugin";
import { WhatsAppConfig } from "./config/whatsapp-config";
import { LogisticsConfig } from "./config/logistics-config";
import { GoogleAnalyticsConfig } from "./config/google-analytics-config";
import { PluginToggle } from "./plugin-toggle";
import {
  useWhatsApps,
  useUpdateWhatsApp,
} from "@/hooks/owner-site/admin/use-whatsapp";
import {
  useLogisticsDash,
  useLogisticsYDM,
  useUpdateLogistics,
} from "@/hooks/owner-site/admin/use-logistics";
import {
  useGoogleAnalytics,
  useUpdateGoogleAnalytics,
} from "@/hooks/owner-site/admin/use-google-analytics";
import { toast } from "sonner";

/* ----------------------------- Modal ----------------------------- */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3 sm:px-6 sm:py-4">
          <h2 className="truncate pr-2 text-base font-semibold text-slate-900 sm:text-lg">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 shrink-0 rounded-md hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto p-3 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Hooks ------------------------------ */
const usePlugins = (websiteType?: string) => {
  const { data: whatsapps = [], isLoading: l1, refetch: r1 } = useWhatsApps();
  const { data: dash = [], isLoading: l2, refetch: r2 } = useLogisticsDash();
  const { data: ydm = [], isLoading: l3, refetch: r3 } = useLogisticsYDM();
  const {
    data: analytics = [],
    isLoading: l4,
    refetch: r4,
  } = useGoogleAnalytics();

  const u1 = useUpdateWhatsApp();
  const u2 = useUpdateLogistics();
  const u3 = useUpdateGoogleAnalytics();

  const [plugins, setPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    const list: Plugin[] = [
      {
        id: "whatsapp",
        name: "WhatsApp Chat",
        description: "Let visitors contact you instantly via WhatsApp",
        category: "COMMUNICATION",
        icon: "/images/icons/whatsapp-icon.png",
        type: "whatsapp",
        is_enabled: whatsapps?.[0]?.is_enabled || false,
      },
      {
        id: "dash",
        name: "Dash Logistics",
        description: "Auto push orders to Dash logistics",
        category: "SHIPPING",
        icon: "/images/icons/dash-logistics.png",
        type: "dash",
        is_enabled: dash?.[0]?.is_enabled || false,
        hideForService: true,
      },
      {
        id: "ydm",
        name: "YDM Logistics",
        description: "Ship orders via YDM logistics",
        category: "SHIPPING",
        icon: "/images/icons/ydm-logistics.png",
        type: "ydm",
        is_enabled: ydm?.[0]?.is_enabled || false,
        hideForService: true,
      },
      {
        id: "google-analytics",
        name: "Google Analytics",
        description: "Track traffic & user behaviour",
        category: "ANALYTICS",
        icon: "/images/icons/google-analytic.png",
        type: "google-analytics",
        is_enabled: analytics?.[0]?.is_enabled || false,
      },
    ];

    setPlugins(
      list.filter(p => !(websiteType === "service" && p.hideForService))
    );
  }, [whatsapps, dash, ydm, analytics, websiteType]);

  const togglePlugin = async (id: string, type: string, enabled: boolean) => {
    try {
      let configExists = false;

      if (type === "whatsapp") {
        if (whatsapps[0]) {
          await u1.mutateAsync({
            id: whatsapps[0].id,
            data: { ...whatsapps[0], is_enabled: enabled },
          });
          await r1();
          configExists = true;
        }
      } else if (type === "dash" || type === "ydm") {
        const cfg = type === "dash" ? dash[0] : ydm[0];
        if (cfg) {
          await u2.mutateAsync({
            id: cfg.id,
            data: { ...cfg, is_enabled: enabled },
          });
          type === "dash" ? await r2() : await r3();
          configExists = true;
        }
      } else if (type === "google-analytics") {
        if (analytics[0]) {
          await u3.mutateAsync({
            id: analytics[0].id,
            data: { ...analytics[0], is_enabled: enabled },
          });
          await r4();
          configExists = true;
        }
      }

      if (configExists) {
        toast.success(`Plugin ${enabled ? "enabled" : "disabled"}`);
        return { success: true, needsConfig: false };
      } else {
        toast.error("Configuration not found. Please configure first.");
        return { success: false, needsConfig: true };
      }
    } catch {
      toast.error("Failed to update plugin");
      return { success: false, needsConfig: true };
    }
  };

  return { plugins, isLoading: l1 || l2 || l3 || l4, togglePlugin };
};

/* --------------------------- Component ---------------------------- */
export default function PluginManager({
  websiteType,
}: {
  websiteType?: string;
}) {
  const { plugins, isLoading, togglePlugin } = usePlugins(websiteType);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("ALL");
  const [active, setActive] = useState<Plugin | null>(null);

  const handleToggle = async (id: string, type: string, enabled: boolean) => {
    const result = await togglePlugin(id, type, enabled);
    if (!result.success && result.needsConfig) {
      const p = plugins.find(pl => pl.id === id);
      if (p) setActive(p);
    }
  };

  const filtered = useMemo(() => {
    return plugins.filter(p => {
      const matchText =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === "ALL" || p.category === tab;
      return matchText && matchTab;
    });
  }, [plugins, search, tab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-8 md:p-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400 sm:h-8 sm:w-8" />
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Loading plugins...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Plugins
            </h1>
            <p className="text-xs text-slate-600 sm:text-sm">
              Extend your website with powerful integrations
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3 sm:h-4 sm:w-4" />
            <Input
              placeholder="Search plugins..."
              className="h-9 rounded-lg border-slate-200 bg-white pl-8 text-xs placeholder:text-slate-400 focus:border-slate-300 focus:ring-1 focus:ring-slate-300 sm:h-10 sm:pl-10 sm:text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="-mx-4 flex justify-start overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <Tabs
            value={tab}
            onValueChange={setTab}
            className="w-full min-w-max sm:w-auto"
          >
            <TabsList className="inline-flex h-9 gap-0.5 rounded-lg bg-slate-50 p-0.5 sm:h-10 sm:gap-1 sm:p-1">
              <TabsTrigger
                value="ALL"
                className="rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm sm:px-4 sm:py-1.5 sm:text-sm"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="COMMUNICATION"
                className="rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm sm:px-4 sm:py-1.5 sm:text-sm"
              >
                Communication
              </TabsTrigger>
              <TabsTrigger
                value="SHIPPING"
                className="rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm sm:px-4 sm:py-1.5 sm:text-sm"
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger
                value="ANALYTICS"
                className="rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm sm:px-4 sm:py-1.5 sm:text-sm"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map(p => {
            return (
              <Card
                key={p.id}
                className="group border-slate-200 bg-white p-2 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4 py-0 sm:p-6">
                  <div className="flex h-full flex-col gap-3 sm:gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                        <img
                          src={p.icon}
                          className="h-10 w-10 shrink-0 rounded-lg object-contain"
                          alt={p.name}
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                            {p.name}
                          </h3>
                          <p className="text-[10px] text-slate-500 sm:text-xs">
                            {p.category}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <PluginToggle
                          pluginId={p.id}
                          pluginType={p.type}
                          isEnabled={p.is_enabled}
                          onToggle={handleToggle}
                        />
                      </div>
                    </div>

                    <p className="line-clamp-2 text-xs text-slate-600 sm:text-sm">
                      {p.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 sm:pt-4">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            p.is_enabled ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                        <span
                          className={`text-[10px] font-medium sm:text-xs ${
                            p.is_enabled ? "text-green-600" : "text-slate-500"
                          }`}
                        >
                          {p.is_enabled ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActive(p)}
                        className="h-7 rounded-md px-2 text-[10px] hover:bg-slate-50 sm:h-8 sm:px-3 sm:text-xs"
                      >
                        <Settings className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:w-3.5" />
                        <span className="hidden sm:inline">Configure</span>
                        <span className="sm:hidden">Config</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white py-12 text-center sm:py-16">
            <div className="mb-3 flex justify-center sm:mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 sm:h-12 sm:w-12">
                <Search className="h-5 w-5 text-slate-400 sm:h-6 sm:w-6" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              No plugins found
            </h3>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setTab("ALL");
              }}
              className="mt-4 h-8 rounded-lg text-xs sm:mt-6 sm:h-9 sm:text-sm"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!active}
        onClose={() => setActive(null)}
        title={`Configure ${active?.name}`}
      >
        {active?.type === "whatsapp" && (
          <WhatsAppConfig
            plugin={active}
            onClose={() => setActive(null)}
            onSave={() => setActive(null)}
          />
        )}
        {(active?.type === "dash" || active?.type === "ydm") && active && (
          <LogisticsConfig
            plugin={active}
            onClose={() => setActive(null)}
            onSave={() => setActive(null)}
          />
        )}
        {active?.type === "google-analytics" && (
          <GoogleAnalyticsConfig
            plugin={active}
            onClose={() => setActive(null)}
            onSave={() => setActive(null)}
          />
        )}
      </Modal>
    </div>
  );
}
