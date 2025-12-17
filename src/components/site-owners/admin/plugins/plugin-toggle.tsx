"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

interface PluginToggleProps {
  pluginId: string;
  pluginType: string;
  isEnabled: boolean;
  onToggle: (
    pluginId: string,
    pluginType: string,
    enabled: boolean
  ) => Promise<void>;
}

export function PluginToggle({
  pluginId,
  pluginType,
  isEnabled,
  onToggle,
}: PluginToggleProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await onToggle(pluginId, pluginType, checked);
      // Success toast is now handled in the parent component's togglePlugin function
    } catch (error) {
      toast.error(`Failed to ${checked ? "enable" : "disable"} plugin`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center" onClick={e => e.stopPropagation()}>
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200"
      />
    </div>
  );
}
