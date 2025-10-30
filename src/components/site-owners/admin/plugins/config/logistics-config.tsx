"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Mail,
  Key,
  Hash,
  Lock,
  FileText,
  Save,
  Truck,
  Package,
} from "lucide-react";
import {
  useLogisticsDash,
  useLogisticsYDM,
  useCreateLogistics,
  useUpdateLogistics,
} from "@/hooks/owner-site/admin/use-logistics";
import { toast } from "sonner";

interface LogisticsConfigProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: any;
  onClose: () => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
}

export function LogisticsConfig({
  plugin,
  onClose,
  onSave,
}: LogisticsConfigProps) {
  // Use the specific hook based on plugin type
  const { data: dashLogistics = [], isLoading: isLoadingDash } =
    useLogisticsDash();
  const { data: ydmLogistics = [], isLoading: isLoadingYDM } =
    useLogisticsYDM();

  const createMutation = useCreateLogistics();
  const updateMutation = useUpdateLogistics();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    client_id: "",
    client_secret: "",
    grant_type: "",
    is_enabled: false,
  });

  // Get the correct logistics data based on plugin type
  const logisticsData = plugin.type === "dash" ? dashLogistics : ydmLogistics;
  const isLoading = plugin.type === "dash" ? isLoadingDash : isLoadingYDM;

  // Find the specific config - assuming each plugin type has only one configuration
  const logisticsConfig = logisticsData.length > 0 ? logisticsData[0] : null;

  useEffect(() => {
    if (logisticsConfig) {
      setFormData({
        email: logisticsConfig.email || "",
        password: logisticsConfig.password || "",
        client_id: logisticsConfig.client_id?.toString() || "",
        client_secret: logisticsConfig.client_secret || "",
        grant_type: logisticsConfig.grant_type || "",
        is_enabled: logisticsConfig.is_enabled,
      });
    } else {
      // Reset form if no config exists
      setFormData({
        email: "",
        password: "",
        client_id: "",
        client_secret: "",
        grant_type: "",
        is_enabled: false,
      });
    }
  }, [logisticsConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_enabled: checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      const logisticName = (plugin.type === "dash" ? "Dash" : "YDM") as
        | "Dash"
        | "YDM";
      const payload = {
        logistic: logisticName,
        email: formData.email,
        password: formData.password,
        client_id: parseInt(formData.client_id),
        client_secret: formData.client_secret,
        grant_type: formData.grant_type,
        is_enabled: formData.is_enabled,
      };

      if (logisticsConfig) {
        // Update existing configuration
        await updateMutation.mutateAsync({
          id: logisticsConfig.id,
          data: payload,
        });
        toast.success(`${plugin.name} configuration updated successfully`);
      } else {
        // Create new configuration
        await createMutation.mutateAsync(payload);
        toast.success(`${plugin.name} configuration created successfully`);
      }

      onSave(formData);
    } catch (error) {
      toast.error(
        `Failed to ${logisticsConfig ? "update" : "create"} ${plugin.name} configuration`
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isFormValid =
    formData.email &&
    formData.password &&
    formData.client_id &&
    formData.client_secret &&
    formData.grant_type;

  const Icon = plugin.type === "dash" ? Truck : Package;

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Icon className="h-8 w-8 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold">{plugin.name}</h3>
            <span className="text-sm text-gray-500">
              {formData.is_enabled ? "Currently active" : "Currently disabled"}
            </span>
          </div>
        </div>
        <Switch
          checked={formData.is_enabled}
          onCheckedChange={handleSwitchChange}
          className="data-[state=checked]:bg-green-600"
        />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={`Enter ${plugin.name} account email`}
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Key className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={`Enter ${plugin.name} password`}
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_id">Client ID *</Label>
          <div className="relative">
            <Hash className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              id="client_id"
              name="client_id"
              type="number"
              placeholder="Enter client ID"
              value={formData.client_id}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_secret">Client Secret *</Label>
          <div className="relative">
            <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              id="client_secret"
              name="client_secret"
              type="password"
              placeholder="Enter client secret"
              value={formData.client_secret}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="grant_type">Grant Type *</Label>
          <div className="relative">
            <FileText className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              id="grant_type"
              name="grant_type"
              type="text"
              placeholder="e.g., client_credentials"
              value={formData.grant_type}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-gray-600 hover:bg-gray-700"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
