"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save, BarChart } from "lucide-react";
import {
  useGoogleAnalytics,
  useCreateGoogleAnalytics,
  useUpdateGoogleAnalytics,
} from "@/hooks/owner-site/admin/use-google-analytics";
import { toast } from "sonner";

interface GoogleAnalyticsConfigProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: any;
  onClose: () => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
}

export function GoogleAnalyticsConfig({
  plugin,
  onClose,
  onSave,
}: GoogleAnalyticsConfigProps) {
  const {
    data: analyticsConfigs = [],
    isLoading,
    refetch,
  } = useGoogleAnalytics();
  const createMutation = useCreateGoogleAnalytics();
  const updateMutation = useUpdateGoogleAnalytics();

  const [formData, setFormData] = useState({
    measurement_id: "",
    is_enabled: false,
  });

  const analyticsConfig =
    analyticsConfigs.length > 0 ? analyticsConfigs[0] : null;

  useEffect(() => {
    if (analyticsConfig) {
      setFormData({
        measurement_id: analyticsConfig.measurement_id || "",
        is_enabled: analyticsConfig.is_enabled,
      });
    }
  }, [analyticsConfig]);

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
    // Validate measurement ID format
    if (!formData.measurement_id.match(/^G-[A-Z0-9]+$/)) {
      toast.error(
        "Invalid Measurement ID format. Should be like: G-XXXXXXXXXX"
      );
      return;
    }

    try {
      if (analyticsConfig) {
        await updateMutation.mutateAsync({
          id: analyticsConfig.id,
          data: formData,
        });
        toast.success("Google Analytics configuration updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Google Analytics configuration created successfully");
      }
      refetch();
      onSave(formData);
    } catch (error) {
      toast.error(
        `Failed to ${analyticsConfig ? "update" : "create"} Google Analytics configuration`
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <img src={plugin.icon} alt={plugin.name} className="h-20 w-20" />
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold">
          How {plugin.name} plugin can help your business?
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Track Website Traffic:</strong> Google Analytics helps you
            understand how visitors find and use your website, providing
            valuable insights into user behavior.
          </p>

          <p>
            <strong>Measure Conversions:</strong> Track sales, sign-ups, and
            other important actions to measure your marketing effectiveness and
            ROI.
          </p>

          <p>
            <strong>Understand Your Audience:</strong> Get detailed information
            about your visitors including demographics, interests, devices, and
            locations.
          </p>

          <p>
            <strong>Optimize Performance:</strong> Use data-driven insights to
            improve your website content, user experience, and marketing
            campaigns.
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="mb-4 flex items-center gap-2 font-semibold">
          Configure The Plugin
          <span className="text-red-500">*</span>
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="block font-medium text-gray-700">
                Enable Plugin
              </span>
              <span className="text-sm text-gray-500">
                {formData.is_enabled
                  ? "Currently active"
                  : "Currently disabled"}
              </span>
            </div>
            <Switch
              checked={formData.is_enabled}
              onCheckedChange={handleSwitchChange}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurement_id">
              Google Analytics Measurement ID *
            </Label>
            <div className="relative">
              <BarChart className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="measurement_id"
                name="measurement_id"
                type="text"
                placeholder="e.g., G-XXXXXXXXXX"
                value={formData.measurement_id}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500">
              Find your Measurement ID in Google Analytics under Admin → Data
              Streams
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4">
            <h5 className="mb-2 font-medium text-blue-900">
              How to get your Measurement ID:
            </h5>
            <ol className="ml-4 list-decimal space-y-1 text-sm text-blue-800">
              <li>Go to Google Analytics (analytics.google.com)</li>
              <li>Click Admin (bottom left)</li>
              <li>Select your property</li>
              <li>Click Data Streams</li>
              <li>Select your web stream</li>
              <li>Copy the Measurement ID (starts with G-)</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gray-600 hover:bg-gray-700"
              disabled={isSubmitting || !formData.measurement_id}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Save className="mr-2 h-4 w-4" />
              Save Setting
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
