"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export function MadeInNepdora() {
  return (
    <Link
      href="https://nepdora.com"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-9999 flex items-center gap-2.5 rounded-full border border-white/10 bg-black/80 px-3.5 py-1.5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-white/20 hover:bg-black/90 active:scale-[0.97]"
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        <Image
          src="/icon.svg"
          alt="Nepdora Logo"
          width={20}
          height={20}
          className="h-full w-full object-contain"
        />
      </div>
      <span className="text-xs font-medium tracking-tight text-white/90">
        Made in <span className="font-bold text-white">Nepdora</span>
      </span>
    </Link>
  );
}
