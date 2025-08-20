"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Globe, Pencil, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SiteManagerProps {
  user: {
    id: number;
    subDomain: string;
    domain: string;
    storeName: string;
  };
}

export function SiteManager({ user }: SiteManagerProps) {
  const router = useRouter();
  const { user: authUser } = useAuth();

  // Determine the base URL for constructing the live site link
  const isProduction = process.env.NODE_ENV === "production";
  const liveUrl = isProduction
    ? `https://${user.subDomain}.${user.domain}`
    : `http://${user.subDomain}.localhost:3000`;

  const handleEdit = () => {
    // Check if user is authenticated before navigating
    if (!authUser) {
      router.push("/login");
      return;
    }
    // Navigate to the builder page with the user ID
    router.push(`/builder/${user.id}`);
  };

  const handlePreview = () => {
    // Check if user is authenticated before navigating
    if (!authUser) {
      router.push("/login");
      return;
    }
    // Navigate to the preview page with the user ID
    router.push(`/preview/${user.id}`);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{user.storeName}</CardTitle>
            <Badge variant="secondary">Active</Badge>
          </div>
          <CardDescription>
            Manage your site settings and actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-shrink-0">
              <Globe className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm leading-none font-medium">Live URL</p>
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-muted-foreground text-sm hover:text-blue-600"
              >
                {liveUrl}
                <ExternalLink className="ml-1 inline-block h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
