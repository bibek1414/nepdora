"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 z-50 w-full px-4 py-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white/40 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>

          <Link href="/" className="transition-opacity hover:opacity-80">
            <img
              src="/nepdora-logooo.svg"
              alt="Nepdora Logo"
              className="h-5 w-auto"
            />
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
