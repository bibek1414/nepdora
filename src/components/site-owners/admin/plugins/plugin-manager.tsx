"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-slate-600">
                Loading plugins...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Plugins
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Extend your website with powerful integrations
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search plugins..."
              className="h-12 rounded-xl border-slate-200/60 bg-white/80 pl-12 text-base shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-500/20"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="inline-flex gap-2 rounded-xl bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
            <TabsTrigger
              value="ALL"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="COMMUNICATION"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Communication
            </TabsTrigger>
            <TabsTrigger
              value="SHIPPING"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Shipping
            </TabsTrigger>
            <TabsTrigger
              value="ANALYTICS"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, index) => (
            <Card
              key={p.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Decorative gradient background */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-3xl transition-all duration-500 group-hover:scale-150" />

              <CardContent className="relative flex h-full flex-col gap-5 p-7">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                      <img src={p.icon} className="h-8 w-8" alt={p.name} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {p.name}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
                      >
                        {p.category}
                      </Badge>
                    </div>
                  </div>
                  <PluginToggle
                    pluginId={p.id}
                    pluginType={p.type}
                    isEnabled={p.is_enabled}
                    onToggle={handleToggle}
                  />
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  {p.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        p.is_enabled
                          ? "bg-green-500 shadow-sm shadow-green-500/50"
                          : "bg-slate-300"
                      }`}
                    />
                    <span
                      className={`text-sm font-semibold ${
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
                    className="group/btn rounded-lg transition-all hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Settings className="mr-2 h-4 w-4 transition-transform group-hover/btn:rotate-90" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white/70 py-20 text-center shadow-lg backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <p className="text-lg font-medium text-slate-600">
              No plugins found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your filters
            </p>
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
