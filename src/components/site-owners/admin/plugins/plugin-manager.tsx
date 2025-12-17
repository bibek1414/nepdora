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
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Plugins</h1>
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
          <Input
            placeholder="Search plugins"
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="gap-2">
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="COMMUNICATION">Communication</TabsTrigger>
          <TabsTrigger value="SHIPPING">Shipping</TabsTrigger>
          <TabsTrigger value="ANALYTICS">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(p => (
          <Card key={p.id} className="rounded-2xl transition hover:shadow-lg">
            <CardContent className="flex h-full flex-col gap-4 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-xl">
                    <img src={p.icon} className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
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

              <p className="text-muted-foreground text-sm">{p.description}</p>

              <div className="mt-auto flex items-center justify-between">
                <span
                  className={`text-xs ${p.is_enabled ? "text-green-600" : "text-muted-foreground"}`}
                >
                  {p.is_enabled ? "Active" : "Inactive"}
                </span>
                <Button variant="ghost" size="sm" onClick={() => setActive(p)}>
                  <Settings className="mr-2 h-4 w-4" /> Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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
