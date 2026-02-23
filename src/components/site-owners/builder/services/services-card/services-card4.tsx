import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { Button } from "@/components/ui/site-owners/button";

interface ServicesPost4Props {
  services: ServicesPost;
  siteUser?: string;

  onClick?: () => void;
  index?: number;
}

export const ServicesCard4: React.FC<ServicesPost4Props> = ({
  services,
  siteUser,
  onClick,
  index = 0,
}) => {
  const pathname = usePathname();
  const serviceImage =
    services.thumbnail_image ||
    "https://images.unsplash.com/photo-1516251193007-4560f385c53b?w=800&h=450&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteUser) {
      if (pathname?.includes("/preview/")) {
        return `/preview/${siteUser}/services/${services.slug}`;
      }
      if (pathname?.includes("/publish/")) {
        return `/services/${services.slug}`;
      }
      return `/services/${services.slug}`;
    }
    return `/services/${services.slug}`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      const detailsUrl = getDetailsUrl();
      window.location.href = detailsUrl;
    }
  };

  const CardWrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={getDetailsUrl()}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );
  const truncatedDescription =
    services.description?.replace(/<[^>]*>/g, "").slice(0, 120) + "...";

  return (
    <CardWrapper>
      <div className="group relative h-full overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={serviceImage}
            alt={services.thumbnail_image_alt_description || services.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={index < 3}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 text-white text-left">
            <h2 className="mb-2 line-clamp-2 text-xl font-bold leading-tight">
              {services.title}
            </h2>
            <p className="mb-4 line-clamp-2 text-sm text-white/80">
                {truncatedDescription}
            </p>
            <span className="inline-block rounded-md bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30">
              Learn More
            </span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
