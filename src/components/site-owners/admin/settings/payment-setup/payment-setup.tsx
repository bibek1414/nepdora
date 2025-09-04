"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, Banknote } from "lucide-react";

interface PaymentGateway {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
}

function PaymentSetupList() {
  const [defaultPayment, setDefaultPayment] = useState("esewa");

  const paymentGateways: PaymentGateway[] = [
    {
      id: "esewas",
      name: "Esewas",
      description:
        "Accept payments via credit cards, debit cards, and digital wallets.",
      icon: <CreditCard className="h-6 w-6" />,
      connected: false,
    },
    {
      id: "khalti",
      name: "Khalti",
      description:
        "Enable payments through PayPal accounts and credit/debit cards.",
      icon: <Building2 className="h-6 w-6" />,
      connected: false,
    },
    {
      id: "bank_transfers",
      name: "Bank Transfers",
      description:
        "Accept payments via bank transfers directly from customer accounts.",
      icon: <Banknote className="h-6 w-6" />,
      connected: false,
    },
  ];

  const defaultPreferences = [
    { id: "esewa", name: "Esewa" },
    { id: "khalti", name: "Khalti" },
  ];

  const handleConnect = (gatewayId: string) => {
    // Handle connection logic here
    console.log(`Connecting ${gatewayId}`);
  };

  const handleSaveChanges = () => {
    // Handle save changes logic here
    console.log(`Default payment method: ${defaultPayment}`);
  };

  return (
    <div className="mx-auto space-y-8 px-4">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-900">Payment Setup</h1>
        <p className="text-sm text-gray-600">
          Configure your payment gateways and methods for your website.
        </p>
      </div>

      {/* Payment Gateways Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Payment Gateways
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentGateways.map(gateway => (
            <div
              key={gateway.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300"
            >
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
                  {gateway.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{gateway.name}</h3>
                  <p className="text-sm text-gray-500">{gateway.description}</p>
                </div>
              </div>
              <Button
                variant={gateway.connected ? "secondary" : "default"}
                onClick={() => handleConnect(gateway.id)}
                className="min-w-[100px]"
              >
                {gateway.connected ? "Connected" : "Connect"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Default Payment Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Default Payment Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={defaultPayment}
            onValueChange={setDefaultPayment}
            className="space-y-4"
          >
            {defaultPreferences.map(preference => (
              <div
                key={preference.id}
                className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4"
              >
                <RadioGroupItem
                  value={preference.id}
                  id={preference.id}
                  className="text-blue-600"
                />
                <Label
                  htmlFor={preference.id}
                  className="flex-1 cursor-pointer font-medium text-gray-900"
                >
                  {preference.name}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSetupList;
