import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { formatDate } from "@/utils/date";

interface ServicesPost3Props {
  services: ServicesPost;
  siteUser?: string;
  onClick?: () => void;
  index?: number;
}

export const ServicesCard3: React.FC<ServicesPost3Props> = ({
  services,
  siteUser,
  onClick,
  index = 0,
}) => {
  const serviceImage =
    services.thumbnail_image ||
    "https://images.unsplash.com/photo-1516251193007-4560f385c53b?w=800&h=450&fit=crop";

  const getDetailsUrl = (): string => {
    if (siteUser) {
      return `/services/${services.slug}`;
    } else {
      return `/services/${services.slug}`;
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
      <div
        className={`grid items-center gap-8 md:grid-cols-2 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
      >
        <div>
          <Image
            src={serviceImage}
            alt={services.thumbnail_image_alt_description || services.title}
            className="aspect-video h-auto w-full rounded-xl object-cover"
            width={800}
            height={450}
          />
        </div>
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {services.title}
          </h2>

          <a
            className="mt-4 inline-block border-b-2 border-gray-900 pb-1 text-sm font-semibold tracking-wider text-gray-900 dark:border-white dark:text-white"
            href={getDetailsUrl()}
          >
            READ MORE
          </a>
        </div>
      </div>
    </CardWrapper>
  );
};
