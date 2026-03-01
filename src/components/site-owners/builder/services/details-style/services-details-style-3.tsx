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
import { AlertCircle, CalendarDays, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date";
import { sanitizeContent } from "@/utils/html-sanitizer";

export const ServiceDetail3: React.FC<{ slug: string; siteUser?: string }> = ({
  slug,
  siteUser,
}) => {
  const pathname = usePathname();
  const { data: service, isLoading, error } = useService(slug);

  const defaultImage =
    "/fallback/image-not-found.png";

  if (isLoading) {
    return (
      <div className="bg-background pt-0 pb-0">
        <Skeleton className="h-[60vh] min-h-[500px] w-full" />
        <div className="relative z-20 container mx-auto -mt-32 max-w-4xl px-4 pb-16">
          <div className="bg-card rounded-2xl border p-8 shadow-xl">
            <Skeleton className="mx-auto h-40 w-full" />
            <Skeleton className="mx-auto mt-8 h-8 w-3/4" />
            <Skeleton className="mx-auto mt-4 h-8 w-1/2" />
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
    <div className="bg-muted/10 min-h-screen pt-0 pb-0">
      {/* Immersive Hero Header */}
      <div className="relative flex h-[70vh] min-h-[500px] w-full items-center justify-center pt-20">
        <Image
          src={serviceImage}
          alt={service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        <div className="relative z-10 container mx-auto mt-12 max-w-4xl px-4 text-center">
          <div className="mb-6 flex justify-center gap-2">
            <Badge className="bg-primary hover:bg-primary border-none px-4 py-1.5 font-bold tracking-widest uppercase shadow-xl">
              Core Service
            </Badge>
          </div>

          <h1 className="mb-8 w-full truncate text-4xl leading-tight font-black text-white drop-shadow-lg sm:text-5xl md:text-6xl lg:text-7xl">
            {service.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-lg font-medium text-white/90 drop-shadow-md">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md">
              <CalendarDays className="h-5 w-5" />
              <span>{formatDate(service.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card Content Container */}
      <div className="relative z-20 container mx-auto -mt-24 max-w-4xl px-4 pb-24 md:-mt-32">
        <div className="bg-background rounded-3xl border p-8 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] md:p-12 lg:p-16">
          <div className="border-border/60 mb-10 flex justify-center border-b pb-8">
            <Breadcrumb>
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
                      className="text-muted-foreground hover:text-primary flex items-center gap-2 font-medium transition-colors"
                    >
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground max-w-[150px] truncate font-semibold sm:max-w-[250px]">
                    {service.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div
            className="prose prose-xl dark:prose-invert rich-text text-foreground mx-auto max-w-none leading-relaxed break-words"
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(service.description),
            }}
          />
        </div>
      </div>
    </div>
  );
};
