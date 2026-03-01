import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { ExternalLink, Github } from "lucide-react";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface PortfolioCard4Props {
  portfolio: Portfolio;
  siteUser?: string;
  onClick?: () => void;
  index?: number;
}

export const PortfolioCard4: React.FC<PortfolioCard4Props> = ({
  portfolio,
  siteUser,
  onClick,
  index = 0,
}) => {
  const pathname = usePathname();
  // ✅ Fallback image
  const portfolioImage =
    portfolio.thumbnail_image ||
    "/fallback/image-not-found.png";

  // ✅ Theme handling
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#F8FAFC",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#1E293B",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const getDetailsUrl = (): string => {
    const isPreviewMode = pathname?.includes("/preview/");
    const basePath = isPreviewMode
      ? "/portfolio-details-draft"
      : "/portfolio-details";
    return generateLinkHref(
      `${basePath}/${portfolio.slug}`,
      siteUser,
      pathname
    );
  };

  const detailsUrl = getDetailsUrl();

  // ✅ Click handler
  const handleClick = () => {
    if (onClick) onClick();
    else window.location.href = detailsUrl;
  };

  // Format index number with leading zero
  const projectNumber = String(index + 1).padStart(2, "0");

  // ✅ Wrapper (Link or Div)
  const Wrapper = siteUser
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={detailsUrl}>{children}</Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      );

  return (
    <Wrapper>
      <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-xl transition-all duration-500">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:gap-12">
          {/* Left Side - Content */}
          <div className="flex flex-1 flex-col justify-between">
            {/* Project Number */}
            <div className="mb-6">
              <h2
                className="text-7xl font-bold text-slate-600 transition-colors duration-300 group-hover:text-slate-500 md:text-8xl lg:text-9xl"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {projectNumber}
              </h2>
            </div>

            {/* Project Title */}
            <div className="mb-4">
              <h3
                className="mb-4 text-2xl font-semibold transition-colors duration-300 group-hover:text-blue-400 md:text-3xl lg:text-4xl"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {portfolio.title}
              </h3>

              {/* Project Description */}
              <p
                className="text-sm leading-relaxed md:text-base lg:text-lg"
                style={{ fontFamily: theme.fonts.body }}
              >
                {portfolio.content?.slice(0, 200) ||
                  "A comprehensive project showcasing modern web development practices and cutting-edge technologies."}
                {portfolio.content && portfolio.content.length > 200 && "..."}
              </p>
            </div>

            {/* Technologies */}
            {portfolio.tags?.length > 0 && (
              <div className="mb-6">
                <p
                  className="text-sm font-medium text-blue-400 md:text-base"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {portfolio.tags.map(tag => tag.name).join(", ")}
                </p>
              </div>
            )}

            {/* Divider Line */}
            <div className="mb-6 h-px w-full bg-slate-700" />

            {/* Action Links */}
            <div className="flex gap-6">
              {portfolio.project_url && (
                <a
                  href={portfolio.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="group/icon transition-transform duration-300 hover:scale-110"
                  title="Live Project"
                >
                  <ExternalLink className="h-8 w-8 text-blue-400 transition-colors duration-300 group-hover/icon:text-blue-300" />
                </a>
              )}
              {portfolio.github_url && (
                <a
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="group/icon transition-transform duration-300 hover:scale-110"
                  title="GitHub Repository"
                >
                  <Github className="h-8 w-8 text-blue-400 transition-colors duration-300 group-hover/icon:text-blue-300" />
                </a>
              )}
            </div>
          </div>

          {/* Right Side - Image Preview */}
          <div className="relative w-full lg:w-1/2">
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={portfolioImage}
                alt={
                  portfolio.thumbnail_image_alt_description || portfolio.title
                }
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Category Badge on Image */}
              {portfolio.category?.name && (
                <div className="absolute top-4 left-4">
                  <span
                    className="rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {portfolio.category.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
