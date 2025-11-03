"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Search } from "lucide-react";
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
        className="bg-opacity-50 absolute inset-0 bg-black/80"
        onClick={onClose}
      />
      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Hook for plugin management with real API integration
const usePlugins = () => {
  const {
    data: whatsapps = [],
    isLoading: isLoadingWhatsApp,
    refetch: refetchWhatsApp,
  } = useWhatsApps();
  const {
    data: dashLogistics = [],
    isLoading: isLoadingDash,
    refetch: refetchDash,
  } = useLogisticsDash();
  const {
    data: ydmLogistics = [],
    isLoading: isLoadingYDM,
    refetch: refetchYDM,
  } = useLogisticsYDM();
  const {
    data: analyticsConfigs = [],
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics,
  } = useGoogleAnalytics();

  const updateWhatsAppMutation = useUpdateWhatsApp();
  const updateLogisticsMutation = useUpdateLogistics();
  const updateAnalyticsMutation = useUpdateGoogleAnalytics();

  const [plugins, setPlugins] = useState<Plugin[]>([]);

  useEffect(() => {
    // Get WhatsApp config
    const whatsappConfig = whatsapps.length > 0 ? whatsapps[0] : null;

    // Get Dash config
    const dashConfig = dashLogistics.length > 0 ? dashLogistics[0] : null;

    // Get YDM config
    const ydmConfig = ydmLogistics.length > 0 ? ydmLogistics[0] : null;

    // Get Google Analytics config
    const analyticsConfig =
      analyticsConfigs.length > 0 ? analyticsConfigs[0] : null;

    const pluginsList: Plugin[] = [
      {
        id: "whatsapp",
        name: "WhatsApp Chat",
        description: "Show WhatsApp chat box on your website",
        category: "COMMUNICATION",
        icon: "/images/icons/whatsapp-icon.png",
        type: "whatsapp",
        is_enabled: whatsappConfig?.is_enabled || false,
      },
      {
        id: "dash",
        name: "Dash Logistics",
        description: "Ship order to dash logistics dashboard",
        category: "SHIPPING",
        icon: "/images/icons/dash-logistics.png",
        type: "dash",
        is_enabled: dashConfig?.is_enabled || false,
      },
      {
        id: "ydm",
        name: "YDM Logistics",
        description: "Ship order to YDM logistics dashboard",
        category: "SHIPPING",
        icon: "/images/icons/ydm-logistics.png",
        type: "ydm",
        is_enabled: ydmConfig?.is_enabled || false,
      },
      {
        id: "google-analytics",
        name: "Google Analytics",
        description: "Track website traffic and user behavior",
        category: "ANALYTICS",
        icon: "/images/icons/google-analytic.png",
        type: "google-analytics",
        is_enabled: analyticsConfig?.is_enabled || false,
      },
    ];

    setPlugins(pluginsList);
  }, [whatsapps, dashLogistics, ydmLogistics, analyticsConfigs]);

  const togglePlugin = async (
    pluginId: string,
    pluginType: string,
    enabled: boolean
  ): Promise<{ success: boolean; needsConfig: boolean }> => {
    try {
      if (pluginType === "whatsapp") {
        const whatsappConfig = whatsapps.length > 0 ? whatsapps[0] : null;
        if (whatsappConfig) {
          await updateWhatsAppMutation.mutateAsync({
            id: whatsappConfig.id,
            data: {
              ...whatsappConfig,
              is_enabled: enabled,
            },
          });
          await refetchWhatsApp();
          toast.success(
            `WhatsApp plugin ${enabled ? "enabled" : "disabled"} successfully`
          );
          return { success: true, needsConfig: false };
        } else {
          toast.error(
            "WhatsApp configuration not found. Please configure first."
          );
          return { success: false, needsConfig: true };
        }
      } else if (pluginType === "dash") {
        const dashConfig = dashLogistics.length > 0 ? dashLogistics[0] : null;
        if (dashConfig) {
          await updateLogisticsMutation.mutateAsync({
            id: dashConfig.id,
            data: {
              ...dashConfig,
              is_enabled: enabled,
            },
          });
          await refetchDash();
          toast.success(
            `Dash Logistics plugin ${enabled ? "enabled" : "disabled"} successfully`
          );
          return { success: true, needsConfig: false };
        } else {
          toast.error(
            "Dash Logistics configuration not found. Please configure first."
          );
          return { success: false, needsConfig: true };
        }
      } else if (pluginType === "ydm") {
        const ydmConfig = ydmLogistics.length > 0 ? ydmLogistics[0] : null;
        if (ydmConfig) {
          await updateLogisticsMutation.mutateAsync({
            id: ydmConfig.id,
            data: {
              ...ydmConfig,
              is_enabled: enabled,
            },
          });
          await refetchYDM();
          toast.success(
            `YDM Logistics plugin ${enabled ? "enabled" : "disabled"} successfully`
          );
          return { success: true, needsConfig: false };
        } else {
          toast.error(
            "YDM Logistics configuration not found. Please configure first."
          );
          return { success: false, needsConfig: true };
        }
      } else if (pluginType === "google-analytics") {
        const analyticsConfig =
          analyticsConfigs.length > 0 ? analyticsConfigs[0] : null;
        if (analyticsConfig) {
          await updateAnalyticsMutation.mutateAsync({
            id: analyticsConfig.id,
            data: {
              ...analyticsConfig,
              is_enabled: enabled,
            },
          });
          await refetchAnalytics();
          toast.success(
            `Google Analytics plugin ${enabled ? "enabled" : "disabled"} successfully`
          );
          return { success: true, needsConfig: false };
        } else {
          toast.error(
            "Google Analytics configuration not found. Please configure first."
          );
          return { success: false, needsConfig: true };
        }
      }
      return { success: false, needsConfig: false };
    } catch (error) {
      toast.error(`Failed to ${enabled ? "enable" : "disable"} plugin`);
      console.error("Toggle plugin error:", error);
      return { success: false, needsConfig: false };
    }
  };

  const isLoading =
    isLoadingWhatsApp || isLoadingDash || isLoadingYDM || isLoadingAnalytics;

  return { plugins, isLoading, togglePlugin };
};

export default function PluginManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { plugins, isLoading, togglePlugin } = usePlugins();

  const filteredPlugins = plugins.filter(
    plugin =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePluginClick = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setIsModalOpen(true);
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (data: any) => {
    console.log("Saving plugin configuration:", data);
    setIsModalOpen(false);
  };

  const handleTogglePlugin = async (
    pluginId: string,
    pluginType: string,
    enabled: boolean
  ) => {
    const result = await togglePlugin(pluginId, pluginType, enabled);

    // If enabling failed due to missing config, open the config modal
    if (enabled && result.needsConfig) {
      const plugin = plugins.find(p => p.id === pluginId);
      if (plugin) {
        setSelectedPlugin(plugin);
        setIsModalOpen(true);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "COMMUNICATION":
        return "bg-blue-100 text-blue-700";
      case "SHIPPING":
        return "bg-green-100 text-green-700";
      case "ANALYTICS":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Input
            type="text"
            placeholder="Search plugins..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 placeholder:text-gray-500"
          />
          <Search className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Header */}
      <h2 className="mb-6 text-2xl font-bold">
        Available Plugins ({filteredPlugins.length})
      </h2>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlugins.map(plugin => (
          <Card
            key={plugin.id}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => handlePluginClick(plugin)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={plugin.icon}
                    alt={plugin.name}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold">{plugin.name}</h3>
                    <Badge className={getCategoryColor(plugin.category)}>
                      {plugin.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{plugin.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <div onClick={e => e.stopPropagation()}>
                      <PluginToggle
                        pluginId={plugin.id}
                        pluginType={plugin.type}
                        isEnabled={plugin.is_enabled}
                        onToggle={handleTogglePlugin}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handlePluginClick(plugin);
                      }}
                    >
                      Configure
                    </Button>
                  </div>

                  {plugin.status && (
                    <Badge variant="secondary" className="mt-2">
                      {plugin.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Configure ${selectedPlugin?.name} Plugin`}
      >
        {selectedPlugin?.type === "whatsapp" && (
          <WhatsAppConfig
            plugin={selectedPlugin}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}

        {(selectedPlugin?.type === "dash" || selectedPlugin?.type === "ydm") &&
          selectedPlugin && (
            <LogisticsConfig
              plugin={selectedPlugin}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
            />
          )}

        {selectedPlugin?.type === "google-analytics" && (
          <GoogleAnalyticsConfig
            plugin={selectedPlugin}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </Modal>
    </div>
  );
}
