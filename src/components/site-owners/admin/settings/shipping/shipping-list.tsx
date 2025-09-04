"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, MapPin, Plus } from "lucide-react";

interface ShippingCarrier {
  id: string;
  name: string;
  status: "Connected" | "Not Connected";
  icon: React.ReactNode;
}

function ShippingList() {
  const shippingCarriers: ShippingCarrier[] = [
    {
      id: "dash_logistics",
      name: "Dash Logistics",
      status: "Not Connected",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      id: "nepal_can_move",
      name: "Nepal Can Move",
      status: "Not Connected",
      icon: <Package className="h-5 w-5" />,
    },
    {
      id: "local_delivery",
      name: "Local Delivery",
      status: "Connected",
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  const handleConnect = (carrierId: string) => {
    // Handle connection logic here
    console.log(`Connecting ${carrierId}`);
  };

  const handleManage = (carrierId: string) => {
    // Handle manage logic here
    console.log(`Managing ${carrierId}`);
  };

  const handleAddCarrier = () => {
    // Handle add carrier logic here
    console.log("Adding new shipping carrier");
  };

  return (
    <div className="mx-auto space-y-8 px-3">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-gray-900">Shipping</h1>
        <p className="text-sm text-gray-600">
          Manage your shipping settings, including shipping zones, methods, and
          rates tailored for Nepal-based logistics providers.
        </p>
      </div>

      {/* Shipping Carriers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                    Carrier
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">
                    Integration
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {shippingCarriers.map(carrier => (
                  <tr key={carrier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 text-gray-600">
                          {carrier.icon}
                        </div>
                        <span className="font-medium text-gray-900">
                          {carrier.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <Badge
                        variant={
                          carrier.status === "Connected"
                            ? "default"
                            : "secondary"
                        }
                        className={
                          carrier.status === "Connected"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {carrier.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 text-right">
                      {carrier.status === "Connected" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleManage(carrier.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Manage
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConnect(carrier.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Connect
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Shipping Carrier Button */}
      <div className="flex justify-start">
        <Button
          variant="secondary"
          onClick={handleAddCarrier}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Shipping Carrier
        </Button>
      </div>
    </div>
  );
}

export default ShippingList;
