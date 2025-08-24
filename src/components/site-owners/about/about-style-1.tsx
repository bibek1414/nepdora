"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AboutUs1Data } from "@/types/owner-site/components/about";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface AboutUsTemplate1Props {
  aboutUsData: AboutUs1Data;
}

export function AboutUsTemplate1({ aboutUsData }: AboutUsTemplate1Props) {
  const { title, subtitle, description, imageUrl, imageAlt, layout, stats } =
    aboutUsData;
  const [imageError, setImageError] = useState(false);

  // Optimize image URL for better performance
  const optimizedImageUrl = imageUrl
    ? optimizeCloudinaryUrl(imageUrl, {
        width: 600,
        height: 450,
        quality: "auto",
        format: "auto",
      })
    : "";

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div
          className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16 ${
            layout === "image-left" ? "md:grid-flow-col-dense" : ""
          }`}
        >
          {/* Content Section */}
          <div className={`${layout === "image-left" ? "md:col-start-2" : ""}`}>
            <h2 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
              {title}
            </h2>
            <p className="text-primary mb-4 text-lg font-semibold">
              {subtitle}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {stats.map(stat => (
                <div key={stat.id} className="text-center">
                  <p className="text-primary text-4xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          <div className={`${layout === "image-left" ? "md:col-start-1" : ""}`}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl">
              {optimizedImageUrl && !imageError ? (
                <Image
                  src={optimizedImageUrl}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div className="text-muted-foreground mx-auto mb-2 h-12 w-12">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {imageError
                        ? "Image failed to load"
                        : "No image available"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
