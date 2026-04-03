"use client";

import { Button } from "@/components/ui/site-owners/button";
import { Home, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface SiteNotFoundProps {
  pageName: string;
  onBackHome: () => void;
}

export function SiteNotFound({ pageName, onBackHome }: SiteNotFoundProps) {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center"
      >
        {/* Icon/Illustration Area */}

        {/* Text Content */}
        <h1 className="mb-4 bg-linear-to-b from-gray-900 to-gray-500 bg-clip-text text-8xl font-black tracking-tighter text-transparent md:text-9xl">
          404
        </h1>

        <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
          Page Not Found
        </h2>

        <p className="mb-10 max-w-md text-lg leading-relaxed text-gray-500">
          Oops! The{" "}
          <span className="inline-block rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-900">
            &apos;{pageName}&apos;
          </span>{" "}
          page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button
            onClick={onBackHome}
            size="lg"
            className="h-12 px-8 text-base font-semibold transition-all hover:scale-105 active:scale-95"
          >
            <Home className="mr-2 h-5 w-5" />
            Go back home
          </Button>

          <Button
            onClick={() => window.history.back()}
            className="group flex items-center px-4 py-2 font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Previous Page
          </Button>
        </div>

        {/* Branding/Footer */}
        <p className="mt-20 flex items-center gap-2 text-xs font-medium text-gray-400">
          <img src="/icon.svg" alt="" className="h-4 w-4" />
          Powered by Nepdora
        </p>
      </motion.div>
    </div>
  );
}
