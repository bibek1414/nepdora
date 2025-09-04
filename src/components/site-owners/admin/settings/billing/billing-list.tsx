"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, CreditCard, Eye } from "lucide-react";

interface PaymentHistory {
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
}

function BillingList() {
  const paymentHistory: PaymentHistory[] = [
    {
      date: "June 15, 2024",
      description: "Pro Plan",
      amount: "$29.00",
      status: "Paid",
    },
    {
      date: "May 15, 2024",
      description: "Pro Plan",
      amount: "$29.00",
      status: "Paid",
    },
    {
      date: "April 15, 2024",
      description: "Pro Plan",
      amount: "$29.00",
      status: "Paid",
    },
  ];

  return (
    <div className="mx-auto space-y-8 px-3">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Billing</h1>
      </div>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <Star className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Pro Plan</h3>
              <p className="text-sm text-gray-500">
                Next payment on July 15, 2024
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Visa •••• 4242</h3>
                <p className="text-sm text-gray-500">Expires 08/2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paymentHistory.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <Badge
                        variant={
                          payment.status === "Paid" ? "default" : "secondary"
                        }
                        className={
                          payment.status === "Paid"
                            ? "bg-gray-100 text-gray-800"
                            : ""
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BillingList;
