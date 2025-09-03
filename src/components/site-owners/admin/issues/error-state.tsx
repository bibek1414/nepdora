"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ErrorState() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardContent className="flex items-center justify-center py-10">
            <div className="text-center">
              <AlertCircle className="text-muted-foreground mx-auto mb-4 h-10 w-10" />
              <p className="text-lg font-medium">Failed to load issues</p>
              <p className="text-muted-foreground">
                Please try refreshing the page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
