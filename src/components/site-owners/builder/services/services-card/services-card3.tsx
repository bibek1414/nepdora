import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <CardWrapper>
      <div
        className={`grid items-center gap-8 md:grid-cols-2 rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
      >
        <div className={index % 2 !== 0 ? "md:order-2" : ""}>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              src={serviceImage}
              alt={services.thumbnail_image_alt_description || services.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
        <div className={index % 2 !== 0 ? "md:order-1" : ""}>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {services.title}
          </h2>
          <p className="mb-6 text-muted-foreground line-clamp-3">
             {services.description?.replace(/<[^>]*>/g, "") || "Read more about this service."}
          </p>

          <span
            className="inline-block border-b-2 border-primary pb-1 text-sm font-semibold tracking-wider text-primary"
          >
            READ MORE
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};
