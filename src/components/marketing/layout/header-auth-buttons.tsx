"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderAuthButtons = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="hidden space-x-4 md:flex">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

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
        <Link href="/admin">
          <Button className="bg-primary/80 rounded-full text-white transition-all duration-200">
            Admin Panel
          </Button>
        </Link>
      )}
    </div>
  );
};
