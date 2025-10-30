"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Phone, Save } from "lucide-react";
import {
  useWhatsApps,
  useCreateWhatsApp,
  useUpdateWhatsApp,
} from "@/hooks/owner-site/admin/use-whatsapp";
import { toast } from "sonner";

interface WhatsAppConfigProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugin: any;
  onClose: () => void;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (data: any) => void;
}

export function WhatsAppConfig({
  plugin,
  onClose,
  onSave,
}: WhatsAppConfigProps) {
  const { data: whatsapps = [], isLoading, refetch } = useWhatsApps();
  const createMutation = useCreateWhatsApp();
  const updateMutation = useUpdateWhatsApp();

  const [formData, setFormData] = useState({
    phone_number: "",
    message: "",
    is_enabled: false,
  });

  const whatsappConfig = whatsapps.length > 0 ? whatsapps[0] : null;

  useEffect(() => {
    if (whatsappConfig) {
      setFormData({
        message: whatsappConfig.message || "",
        phone_number: whatsappConfig.phone_number || "",
        is_enabled: whatsappConfig.is_enabled,
      });
    }
  }, [whatsappConfig]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      if (whatsappConfig) {
        await updateMutation.mutateAsync({
          id: whatsappConfig.id,
          data: formData,
        });
        toast.success("WhatsApp configuration updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("WhatsApp configuration created successfully");
      }
      refetch();
      onSave(formData);
    } catch (error) {
      toast.error(
        `Failed to ${whatsappConfig ? "update" : "create"} WhatsApp configuration`
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
            <strong>Customer Support:</strong> WhatsApp chat plugins allow
            businesses to provide instant customer support, helping to resolve
            customer issues quickly and efficiently.
          </p>

          <p>
            <strong>Increased Engagement:</strong> WhatsApp chat plugins provide
            an additional channel for businesses to connect with customers,
            helping to increase engagement and build stronger relationships.
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
            <Label htmlFor="phone_number">WhatsApp Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                placeholder="eg: 9779805300000"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Welcome Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Enter your welcome message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-gray-600 hover:bg-gray-700"
              disabled={
                isSubmitting || !formData.phone_number || !formData.message
              }
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
