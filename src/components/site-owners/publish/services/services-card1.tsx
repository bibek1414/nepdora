import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { ServicesPost } from "@/types/owner-site/admin/services";

interface ServicesCard1Props {
  services: ServicesPost;
  siteUser?: string;
  showReadTime?: boolean;
  onClick?: () => void;
}

export const ServicesCard1: React.FC<ServicesCard1Props> = ({
  services,
  siteUser,
  onClick,
}) => {
  const servicesImage =
    services.thumbnail_image ||
    "https://images.unsplash.com/photo-1492538368677-f6e0ac4024a1?w=600&h=400&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/servicess/${services.slug}`;
    } else {
      return `/servicess/${services.slug}`;
    }
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

  return (
    <CardWrapper>
      <div className="bg-background-light h-full overflow-hidden rounded-lg shadow-md dark:bg-zinc-800">
        <div className="relative h-56 w-full">
          <Image
            src={servicesImage}
            alt={services.thumbnail_image_alt_description || services.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
            {services.title}
          </h2>
        </div>
      </div>
    </CardWrapper>
  );
};
