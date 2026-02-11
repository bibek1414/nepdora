"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface BuilderSkeletonProps {
  isCreatingHomePage?: boolean;
}

export const BuilderSkeleton: React.FC<BuilderSkeletonProps> = ({
  isCreatingHomePage = false,
}) => {
  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation Skeleton */}
      <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b bg-white">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Dashboard Button */}
            <Skeleton className="h-8 w-28 rounded-full bg-gray-200" />

            {/* Page Management Divider & Text */}
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <Skeleton className="h-4 w-28 bg-gray-200" />
            </div>

            {/* Page Tabs */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24 rounded-md bg-gray-200" />
              <Skeleton className="h-8 w-24 rounded-md bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-md bg-gray-200" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32 rounded-full bg-gray-200" />
            <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
            <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
            <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
            <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex min-h-screen pt-16">
        {/* Canvas Area (Centered) */}
        <div className="flex flex-1 flex-col">
          <div className="mt-10 flex-1 overflow-hidden bg-gray-200 p-6">
            <div className="mx-auto max-w-7xl origin-top scale-75">
              {/* Page Title */}
              <div className="mb-4 py-4">
                <Skeleton className="h-8 w-48 bg-gray-300/50" />
              </div>

              {/* Canvas Content Skeletons */}
              <div className="space-y-6">
                {/* Hero Section Skeleton */}
                <div
                  className="w-full overflow-hidden rounded-lg border border-gray-300 bg-white"
                  style={{ height: "500px" }}
                >
                  <div className="flex h-full flex-col md:flex-row">
                    <div className="flex w-full flex-col justify-center space-y-6 p-12 md:w-1/2">
                      <Skeleton className="h-12 w-3/4 bg-gray-100" />
                      <Skeleton className="h-4 w-full bg-gray-100" />
                      <Skeleton className="h-4 w-5/6 bg-gray-100" />
                      <div className="mt-4 flex gap-4">
                        <Skeleton className="h-10 w-32 rounded-md bg-gray-100" />
                        <Skeleton className="h-10 w-32 rounded-md bg-gray-100" />
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-center bg-gray-50 p-8 md:w-1/2">
                      <Skeleton className="h-64 w-80 rounded-lg bg-gray-200" />
                    </div>
                  </div>
                </div>

                {/* Features Section Skeleton */}
                <div className="w-full rounded-lg border border-gray-300 bg-white p-12">
                  <div className="mb-10 flex flex-col items-center space-y-4 text-center">
                    <Skeleton className="h-8 w-1/3 bg-gray-100" />
                    <Skeleton className="h-4 w-1/2 bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="mb-4 h-12 w-12 rounded-lg bg-gray-100" />
                        <Skeleton className="h-6 w-3/4 bg-gray-100" />
                        <Skeleton className="h-20 w-full bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isCreatingHomePage && (
                <div className="mt-8 text-center">
                  <p className="animate-pulse text-gray-500">
                    Initializing your workspace...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Component Outline) */}
        <aside className="sticky top-16 right-0 h-[calc(100vh-4rem)] w-40 shrink-0 overflow-y-auto border-l bg-white">
          <div className="border-b px-3 py-2">
            <Skeleton className="mb-1 h-4 w-20 bg-gray-200" />
            <Skeleton className="h-3 w-32 bg-gray-100" />
          </div>
          <div className="space-y-1 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md bg-gray-50 p-2"
              >
                <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
                <Skeleton className="h-3 w-20 bg-gray-200" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BuilderSkeleton;
