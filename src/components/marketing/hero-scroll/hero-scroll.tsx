"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <div className="pb-6 text-3xl font-light tracking-tight text-black dark:text-white">
              <span>For creators</span>
              <span className="mx-2 text-5xl font-extrabold">.</span>
              <span>For businesses</span>
              <span className="mx-2 text-5xl font-extrabold">.</span>
              <span>For Nepal</span> <br />
              <span className="mt-1 text-4xl leading-none font-bold tracking-tight md:text-[6rem]">
                5 minute मा Website
              </span>
            </div>
          </>
        }
      >
        <Image
          src="/images/image3.avif"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto h-full rounded-2xl object-cover object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
