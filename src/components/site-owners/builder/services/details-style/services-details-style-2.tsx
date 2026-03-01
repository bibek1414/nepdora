"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useService } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertCircle, CheckCircle, Home, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sanitizeContent } from "@/utils/html-sanitizer";

export const ServiceDetail2: React.FC<{ slug: string; siteUser?: string }> = ({
  slug,
  siteUser,
}) => {
  const pathname = usePathname();
  const { data: service, isLoading, error } = useService(slug);

  const defaultImage = "/fallback/image-not-found.png";

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="mb-6 h-5 w-64" />
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="mb-12 h-[450px] w-full rounded-2xl" />
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message ||
                "Could not load service details. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const serviceImage = service.thumbnail_image || defaultImage;

  return (
    <div className="bg-background pt-20 pb-0">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-16">
        {/* Header Section */}
        <div className="mb-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={
                      siteUser
                        ? pathname?.includes("/preview/")
                          ? `/preview/${siteUser}`
                          : `/`
                        : "/"
                    }
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 max-w-[200px] font-medium md:max-w-[400px]">
                  {service.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
            {service.title}
          </h1>
        </div>

        {/* Big Hero Image */}
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl shadow-sm md:h-[550px] lg:mb-20">
          <Image
            src={serviceImage}
            alt={service.title}
            fill
            className="object-cover transition-transform duration-700 ease-in-out hover:scale-105"
            priority
          />
        </div>

        {/* Content Layout (Sidebar approach) */}
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-xl dark:prose-invert rich-text max-w-none break-words"
              dangerouslySetInnerHTML={{
                __html: sanitizeContent(service.description),
              }}
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Value Props Card */}
            <div className="bg-primary/5 border-primary/10 rounded-2xl border p-6 shadow-sm">
              <h4 className="mb-4 text-lg font-bold">Why Choose Us</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="bg-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold">Certified Experts</h5>
                    <p className="text-muted-foreground text-xs">
                      Our team consists of industry veterans.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold">Quality Assured</h5>
                    <p className="text-muted-foreground text-xs">
                      We guarantee the best results possible.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="bg-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold">Targeted Support</h5>
                    <p className="text-muted-foreground text-xs">
                      We stay with you every step of the way.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
