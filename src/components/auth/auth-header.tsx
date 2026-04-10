"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 z-50 flex w-full items-center justify-between p-4 md:p-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white/40 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-all hover:bg-white/80 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Button>
        <div className="absolute px-24">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <img
              src="/nepdora-logooo.svg"
              alt="Nepdora Logo"
              className="h-4 w-auto md:h-4"
            />
          </Link>
        </div>
      </div>

      <div className="hidden items-center gap-3 sm:flex">
        {/* Optional: Add Help or Support link here if needed in future */}
      </div>
    </header>
  );
}
