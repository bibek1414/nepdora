// components/site-owners/admin/plugins/logistics/dash.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Truck,
  Mail,
  Key,
  Hash,
  Lock,
  FileText,
  Save,
} from "lucide-react";
import {
  useLogisticsDash,
  useCreateLogistics,
  useUpdateLogistics,
} from "@/hooks/owner-site/admin/use-logistics";
import { toast } from "sonner";
import { Logistics } from "@/types/owner-site/admin/logistics";

function DashPage() {
  const { data: logistics = [], isLoading, refetch } = useLogisticsDash();
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

  const dashConfig = logistics.find((l: Logistics) => l.logistic === "Dash");

  useEffect(() => {
    if (dashConfig) {
      setFormData({
        email: dashConfig.email || "",
        password: dashConfig.password || "",
        client_id: dashConfig.client_id?.toString() || "",
        client_secret: dashConfig.client_secret || "",
        grant_type: dashConfig.grant_type || "",
        is_enabled: dashConfig.is_enabled,
      });
    }
  }, [dashConfig]);

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

  const handleSave = async () => {
    try {
      const payload = {
        logistic: "Dash" as const,
        email: formData.email,
        password: formData.password,
        client_id: parseInt(formData.client_id),
        client_secret: formData.client_secret,
        grant_type: formData.grant_type,
        is_enabled: formData.is_enabled,
      };

      if (dashConfig) {
        await updateMutation.mutateAsync({
          id: dashConfig.id,
          data: payload,
        });
        toast.success("Dash configuration updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Dash configuration created successfully");
      }

      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${dashConfig ? "update" : "create"} Dash configuration`
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
                    <Truck className="h-6 w-6 text-gray-600" />
                    <div>
                      <span className="block font-medium text-gray-700">
                        Dash Logistics
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

            <div className="mt-10 space-y-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter Dash account email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Key className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter Dash password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="client_id"
                      className="text-sm font-medium text-gray-700"
                    >
                      Client ID *
                    </Label>
                    <div className="relative">
                      <Hash className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="client_id"
                        name="client_id"
                        type="number"
                        placeholder="Enter client ID"
                        value={formData.client_id}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="client_secret"
                      className="text-sm font-medium text-gray-700"
                    >
                      Client Secret *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="client_secret"
                        name="client_secret"
                        type="password"
                        placeholder="Enter client secret"
                        value={formData.client_secret}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="grant_type"
                      className="text-sm font-medium text-gray-700"
                    >
                      Grant Type *
                    </Label>
                    <div className="relative">
                      <FileText className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="grant_type"
                        name="grant_type"
                        type="text"
                        placeholder="e.g., client_credentials"
                        value={formData.grant_type}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !isFormValid}
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

export default DashPage;
