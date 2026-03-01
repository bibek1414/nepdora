"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useService } from "@/hooks/owner-site/admin/use-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface ServiceDetailProps {
  slug: string;
  siteUser?: string;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  slug,
  siteUser,
}) => {
  const pathname = usePathname();
  const { data: service, isLoading, error } = useService(slug);

  const defaultImage = "/fallback/image-not-found.png";

  if (isLoading) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto mb-12 px-4 md:px-8">
          <div className="mb-6 flex justify-center">
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="mx-auto mb-8 max-w-4xl space-y-4 text-center">
            <Skeleton className="mx-auto h-12 w-3/4" />
          </div>
          <Skeleton className="mx-auto mb-10 aspect-[16/9] h-[300px] w-full rounded-xl md:h-[450px]" />
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="bg-background pt-20 pb-0">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mx-auto max-w-2xl">
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
      <div className="container mx-auto mb-12 px-4 md:px-8">
        <nav className="mb-6">
          <ol className="text-muted-foreground flex flex-wrap items-center justify-center gap-2 text-sm">
            <li>
              <Link
                href={
                  siteUser
                    ? pathname?.includes("/preview/")
                      ? `/preview/${siteUser}`
                      : `/`
                    : "/"
                }
                className="hover:text-primary font-medium transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground line-clamp-1 text-center font-medium">
              {service.title}
            </li>
          </ol>
        </nav>

        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h1 className="text-foreground mb-4 text-3xl leading-[1.15] font-semibold md:text-5xl lg:text-6xl">
            {service.title}
          </h1>
        </div>

        <div className="mx-auto mb-10 aspect-[16/9] h-[300px] overflow-hidden rounded-xl shadow-lg md:h-[450px]">
          <Image
            src={serviceImage}
            alt={service.title}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="prose prose-xl dark:prose-invert rich-text mx-auto mb-20 max-w-3xl space-y-8 leading-8">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeContent(service.description),
            }}
          />
        </div>
      </div>
    </div>
  );
};
