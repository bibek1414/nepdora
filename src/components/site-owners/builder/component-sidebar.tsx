"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  MessageSquare,
  Sparkles,
  Info,
  Package,
  FileText,
  ArrowLeft,
  Eye,
  Palette,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ComponentSidebarProps {
  siteUser: string;
  onComponentClick?: (componentId: string) => void;
}

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  siteUser,
  onComponentClick,
}) => {
  const router = useRouter();

  const handlePreview = () => {
    router.push(`/preview/${siteUser}`);
  };

  const handleBackToDashboard = () => {
    router.push("/admin");
  };

  const handleComponentClick = (componentId: string) => {
    if (onComponentClick) {
      onComponentClick(componentId);
    } else {
      console.log(`${componentId} clicked`);
    }
  };

  return (
    <div className="w-64 border-r bg-white shadow-sm">
      <div className="flex h-full flex-col">
        {/* Action Buttons */}
        <div className="border-b p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToDashboard}
              className="w-full justify-start text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="w-full justify-start text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-purple-600 hover:bg-purple-50 hover:text-purple-700"
            >
              <Palette className="mr-2 h-4 w-4" />
              Theme
            </Button>
          </div>
        </div>

        {/* Component Sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Site Structure Section */}
          <div className="p-4">
            <div className="mb-3">
              <Badge
                variant="default"
                className="rounded-full bg-purple-600 px-3 py-1 text-sm font-medium text-white"
              >
                Site Structure ( Basics )
              </Badge>
            </div>

            <div className="space-y-1">
              <div
                className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                onClick={() => handleComponentClick("navbar")}
              >
                <div className="flex items-center">
                  <Navigation className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Navbar</span>
                </div>
              </div>

              <div
                className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                onClick={() => handleComponentClick("footer")}
              >
                <div className="flex items-center">
                  <MessageSquare className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Footer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Site Components Section */}
          <div className="p-4">
            <div className="mb-3">
              <Badge
                variant="default"
                className="rounded-full bg-purple-600 px-3 py-1 text-sm font-medium text-white"
              >
                Site Components (Advanced)
              </Badge>
            </div>

            <div className="space-y-1">
              <div
                className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                onClick={() => handleComponentClick("hero-sections")}
              >
                <div className="flex items-center">
                  <Sparkles className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Hero Sections</span>
                </div>
              </div>

              <div
                className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                onClick={() => handleComponentClick("about-sections")}
              >
                <div className="flex items-center">
                  <Info className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">About Sections</span>
                </div>
              </div>

              <div
                className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                onClick={() => handleComponentClick("product-displays")}
              >
                <div className="flex items-center">
                  <Package className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Product Displays</span>
                </div>
              </div>

              <div
                className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors hover:bg-gray-50"
                onClick={() => handleComponentClick("text-block")}
              >
                <div className="flex items-center">
                  <FileText className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Text Block</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
