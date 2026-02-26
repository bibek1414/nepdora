"use client";
import React from "react";
import Image from "next/image";
import { useService } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ServiceDetail3: React.FC<{ slug: string; siteUser?: string }> = ({
  slug,
}) => {
  const { data: service, isLoading, error } = useService(slug);

  if (isLoading)
    return (
      <div className="p-12">
        <Skeleton className="h-80 w-full" />
      </div>
    );
  if (error || !service)
    return (
      <div className="container p-12">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
        </Alert>
      </div>
    );

  return (
    <div className="bg-slate-50 pb-20 dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl px-4 pt-16 pb-8 text-center">
        <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 uppercase md:text-6xl dark:text-white">
          {service.title}
        </h1>
        <div className="bg-primary mx-auto mb-10 h-1.5 w-24 rounded-full" />
      </div>

      <div className="container mx-auto mb-16 max-w-6xl px-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-8 border-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] dark:border-slate-800">
          <Image
            src={
              service.thumbnail_image ||
              "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=800&h=600&fit=crop"
            }
            alt={service.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="hover:text-primary h-20 w-20 rounded-full bg-white/30 text-white backdrop-blur transition-transform hover:scale-110 hover:bg-white"
            >
              <PlayCircle className="h-10 w-10" />
            </Button>
            <span className="mt-4 font-semibold tracking-wider text-white">
              Watch Intro
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-white p-8 shadow-xl md:p-12 dark:bg-slate-800">
          <h3 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100">
            Service Overview
          </h3>
          <div
            className="prose prose-lg dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white max-w-none"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />

          <div className="mt-12 flex justify-center border-t pt-8 dark:border-slate-700">
            <Button
              size="lg"
              className="h-14 w-full px-12 text-lg font-bold md:w-auto"
            >
              Request This Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
