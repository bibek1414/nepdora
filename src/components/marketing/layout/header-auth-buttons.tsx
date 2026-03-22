"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { buildTenantFrontendUrl } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const HeaderAuthButtons = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="hidden space-x-4 md:flex">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  // Determine the admin URL based on the user's subdomain
  const adminUrl = user?.sub_domain
    ? buildTenantFrontendUrl(user.sub_domain, {
        path: "/admin",
        isDev: siteConfig.isDev,
        baseDomain: siteConfig.baseDomain,
        port: siteConfig.frontendDevPort,
      })
    : "/admin";

  return (
    <div className="hidden items-center space-x-4 md:flex">
      {!isAuthenticated ? (
        <>
          <Link href="/admin/login">
            <Button variant="secondary" rounded={true}>
              Sign In
            </Button>
          </Link>
          <Link href="/admin/signup">
            <Button variant="primary" rounded={true}>
              Create Your Website for Free
            </Button>
          </Link>
        </>
      ) : (
        <Link href={adminUrl}>
          <Button className="bg-primary/80 rounded-full text-white transition-all duration-200">
            Admin Panel
          </Button>
        </Link>
      )}
    </div>
  );
};
