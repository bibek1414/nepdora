"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Wallet, Save } from "lucide-react";
import {
  usePaymentGatewaysKhalti,
  useCreatePaymentGateway,
  useUpdatePaymentGateway,
} from "@/hooks/owner-site/admin/use-payment-gateway";
import { toast } from "sonner";
import { PaymentGateway } from "@/types/owner-site/admin/payment-gateway";

function KhaltiPage() {
  const {
    data: gateways = [],
    isLoading,
    refetch,
  } = usePaymentGatewaysKhalti();
  const createMutation = useCreatePaymentGateway();
  const updateMutation = useUpdatePaymentGateway();

  const [formData, setFormData] = useState({
    secret_key: "",
    is_enabled: false,
  });

  const khaltiConfig = gateways.find(
    (g: PaymentGateway) => g.payment_type === "khalti"
  );

  useEffect(() => {
    if (khaltiConfig) {
      setFormData({
        secret_key: khaltiConfig.secret_key,
        is_enabled: khaltiConfig.is_enabled,
      });
    }
  }, [khaltiConfig]);

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
      if (khaltiConfig) {
        await updateMutation.mutateAsync({
          id: khaltiConfig.id,
          data: {
            payment_type: "khalti" as const,
            secret_key: formData.secret_key,
            is_enabled: formData.is_enabled,
          },
        });
        toast.success("Khalti configuration updated successfully");
      } else {
        await createMutation.mutateAsync({
          payment_type: "khalti" as const,
          secret_key: formData.secret_key,
          is_enabled: formData.is_enabled,
        });
        toast.success("Khalti configuration created successfully");
      }

      refetch();
    } catch (error) {
      toast.error(
        `Failed to ${khaltiConfig ? "update" : "create"} Khalti configuration`
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
                        Khalti Payment Gateway
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
                      htmlFor="secret_key"
                      className="text-sm font-medium text-gray-700"
                    >
                      Secret Key
                    </Label>
                    <div className="relative">
                      <Wallet className="absolute top-3 left-3 z-10 h-4 w-4 text-gray-400" />
                      <Input
                        id="secret_key"
                        name="secret_key"
                        type="password"
                        placeholder="Enter your Khalti secret key"
                        value={formData.secret_key}
                        onChange={handleInputChange}
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Keep your secret key secure and never share it publicly
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting || !formData.secret_key}
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

export default KhaltiPage;
