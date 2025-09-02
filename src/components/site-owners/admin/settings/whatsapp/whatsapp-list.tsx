"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Phone, MessageCircle, Save } from "lucide-react";
import {
  useWhatsApps,
  useCreateWhatsApp,
  useUpdateWhatsApp,
} from "@/hooks/owner-site/use-whatsapp";
import { toast } from "sonner";

interface WhatsApp {
  id: string;
  phone_number: string;
  message: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

function WhatsAppList() {
  const { data: whatsapps = [], isLoading, refetch } = useWhatsApps();
  const createMutation = useCreateWhatsApp();
  const updateMutation = useUpdateWhatsApp();

  const [formData, setFormData] = useState({
    message: "",
    phone_number: "",
    is_enabled: false,
  });

  const whatsappConfig = whatsapps.length > 0 ? whatsapps[0] : null;

  useEffect(() => {
    if (whatsappConfig) {
      setFormData({
        message: whatsappConfig.message,
        phone_number: whatsappConfig.phone_number,
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

  const handleSave = async () => {
    try {
      if (whatsappConfig) {
        // Update existing
        await updateMutation.mutateAsync({
          id: whatsappConfig.id,
          data: formData,
        });
        toast.success("WhatsApp configuration updated successfully");
      } else {
        // Create new
        await createMutation.mutateAsync(formData);
        toast.success("WhatsApp configuration created successfully");
      }

      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${whatsappConfig ? "update" : "create"} WhatsApp configuration`
      );
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card className="border-none p-0 shadow-none">
        <CardContent className="p-0">
          <div className="grid min-h-[400px] max-w-2xl grid-cols-1 px-2 lg:grid-cols-2">
            <div className="mt-5 space-y-6">
              <div>
                <div className="flex items-center justify-start gap-5 py-4">
                  <div className="flex items-start gap-3">
                    <div>
                      <span className="block font-medium text-gray-700">
                        WhatsApp Integration
                      </span>
                      <span className="text-sm text-gray-500">
                        {formData.is_enabled
                          ? "Currently active"
                          : "Currently disabled"}
                      </span>
                    </div>
                  </div>
                  <Switch
                    checked={formData.is_enabled}
                    onCheckedChange={handleSwitchChange}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Configuration Form */}
            <div className="mt-10 space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Phone className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        placeholder="Enter your WhatsApp Business number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Welcome Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Enter your welcome message that will be sent to customers"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      This message will be automatically sent when customers
                      contact you via WhatsApp
                    </p>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={
                        isSubmitting ||
                        !formData.phone_number ||
                        !formData.message
                      }
                      className="h-11 w-full bg-gray-600 text-white hover:bg-gray-700"
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WhatsAppList;
