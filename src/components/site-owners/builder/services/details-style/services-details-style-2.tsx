"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useService } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ServiceDetail2: React.FC<{ slug: string; siteUser?: string }> = ({
  slug,
  siteUser,
}) => {
  const { data: service, isLoading, error } = useService(slug);

  const defaultImage =
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=800&h=600&fit=crop";

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

  const serviceImage = service.thumbnail_image || defaultImage;

  return (
    <div className="bg-background pb-20">
      {/* Split Hero */}
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-24">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="flex-1 space-y-8">
            <div className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-sm font-semibold tracking-wide uppercase">
              Our Service
            </div>
            <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl lg:text-7xl">
              {service.title}
            </h1>
            <p className="text-muted-foreground max-w-lg text-xl leading-relaxed">
              Comprehensive solutions designed to help you achieve your goals
              effectively and efficiently.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                size="lg"
                className="shadow-primary/20 rounded-full px-8 shadow-xl"
              >
                Get Started Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Talk to Sales
              </Button>
            </div>
          </div>

          <div className="relative w-full max-w-xl flex-1 lg:max-w-none">
            <div className="bg-primary/5 absolute inset-0 z-0 scale-105 -rotate-3 transform rounded-[3rem]" />
            <div className="border-background relative z-10 aspect-square overflow-hidden rounded-[2rem] border-4 shadow-2xl md:aspect-[4/3]">
              <Image
                src={serviceImage}
                alt={service.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Floating badge */}
            <div className="bg-background absolute -bottom-6 -left-6 z-20 flex animate-pulse items-center gap-4 rounded-xl border p-4 shadow-xl">
              <div className="bg-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Trusted Expert</p>
                <p className="text-muted-foreground text-xs">
                  Certified Professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto mt-8 max-w-4xl px-4">
        <div className="border-t py-12">
          <h2 className="mb-8 text-2xl font-bold">What are the details?</h2>
          <div
            className="prose prose-lg dark:prose-invert text-muted-foreground bg-muted/30 max-w-none rounded-3xl p-8 md:p-12"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </div>
      </div>
    </div>
  );
};
