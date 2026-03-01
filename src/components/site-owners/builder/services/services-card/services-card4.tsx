import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
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
    services.thumbnail_image || "/fallback/image-not-found.png";

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/service-details-draft"
      : "/service-details";
    return generateLinkHref(`${basePath}/${services.slug}`, siteUser, pathname);
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
    services.description.length > 150
      ? services.description.slice(0, 150) + "..."
      : services.description;
  return (
    <CardWrapper>
      <div className="group relative rounded-xl bg-white transition-all duration-300 dark:bg-gray-800">
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full">
          <Image
            src={serviceImage}
            alt={services.thumbnail_image_alt_description || services.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            width={600}
            height={450}
            priority={index < 3}
          />

          {/* Content Overlay */}
          <div className="mt-2 text-black">
            <h2 className="mb-3 line-clamp-2 text-xl font-semibold text-gray-900 dark:text-white">
              {services.title}
            </h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: truncatedDescription }}
            />
            <Button variant="default" size="sm" className="mt-2">
              <a href={getDetailsUrl()}>Learn More</a>
            </Button>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
