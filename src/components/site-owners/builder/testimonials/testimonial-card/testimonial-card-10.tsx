import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { EditableImage } from "@/components/ui/editable-image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";

interface TestimonialCard10Props {
  testimonials: Testimonial[];
  onClick?: (testimonial: Testimonial) => void;
  backgroundImage?: string;
  isEditable?: boolean;
  onBackgroundChange?: (imageUrl: string) => void;
}

const DEFAULT_BACKGROUND_IMAGE = "/fallback/image-not-found.png";

const QuoteIcon: React.FC<{ color: string }> = ({ color }) => {
  return (
    <svg
      width="66"
      height="52"
      viewBox="0 0 66 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.7637 4.98242C52.1359 6.14112 44.673 14.3302 44.6729 24.2559C44.6729 25.5512 45.7046 26.583 47 26.583H64.2842V50.0869H40.7812V24.2559C40.7814 12.1979 49.9979 2.2484 61.7637 1.0791V4.98242ZM21.9561 4.98438C17.419 5.53979 13.2118 7.68094 10.0869 11.0439C6.75042 14.6347 4.89444 19.3543 4.8916 24.2559L4.90332 24.4961C5.02154 25.6766 6.00446 26.583 7.21875 26.583H24.5039V50.0869H1V24.2559C1.00015 12.1981 10.2162 2.24935 21.9561 1.0791V4.98438Z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

export const TestimonialCard10: React.FC<TestimonialCard10Props> = ({
  testimonials,
  onClick,
  backgroundImage,
  isEditable = false,
  onBackgroundChange,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const quoteColor =
    themeResponse?.data?.[0]?.data?.theme?.colors?.primary || "#50FEA8";

  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = useMemo(() => testimonials || [], [testimonials]);
  const total = slides.length;

  const activeTestimonial = useMemo(
    () => (total > 0 ? slides[currentIndex % total] : undefined),
    [slides, total, currentIndex]
  );

  const backgroundSrc = backgroundImage || DEFAULT_BACKGROUND_IMAGE;

  const handleDotClick = useCallback(
    (index: number) => {
      if (index < 0 || index >= total) return;
      setCurrentIndex(index);
    },
    [total]
  );

  if (!activeTestimonial) return null;

  return (
    <div className="flex w-full justify-center overflow-x-visible">
      {/* 
        Main Container 
        Compacted dimensions:
        Total Width roughly ~1000px (down from ~1300px)
        Height ~540px (down from ~700px)
      */}
      <div className="relative min-h-[540px] w-full max-w-[1000px]">
        {/* Gray Background Layer */}
        <div className="absolute top-0 left-0 hidden h-[540px] w-[550px] rounded-[20px] lg:block">
          {isEditable ? (
            <EditableImage
              src={backgroundSrc}
              alt="Testimonials background"
              onImageChange={imageUrl => onBackgroundChange?.(imageUrl)}
              isEditable={isEditable}
              width={550}
              height={540}
              className="h-[540px] w-[550px] rounded-[20px]"
              placeholder={{
                width: 550,
                height: 540,
                text: "Upload background image",
              }}
              imageOptimization={{
                width: 1100,
                height: 1080,
                quality: "auto",
                format: "auto",
                crop: "fill",
              }}
              cloudinaryOptions={{
                folder: "testimonial-backgrounds",
                resourceType: "image",
              }}
            />
          ) : backgroundImage ? (
            <Image
              src={backgroundSrc}
              alt="Testimonials background"
              width={550}
              height={540}
              className="h-full w-full rounded-[20px] object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-[20px] bg-[#D9D9D9]" />
          )}
        </div>

        {/* 
          White Foreground Card 
          Compacted dimensions and offsets
        */}
        <div
          className="relative top-0 left-0 z-10 flex min-h-[440px] w-full flex-col justify-between rounded-[20px] bg-white p-8 shadow-[0px_0px_60px_rgba(0,0,0,0.05)] md:p-10 lg:absolute lg:top-[50px] lg:left-[400px] lg:w-[600px]"
          onClick={() => onClick?.(activeTestimonial)}
        >
          <div>
            {/* Icon - Scaled down slightly to fit compact look */}
            <div className="mb-6 origin-top-left scale-90 md:mb-8">
              <QuoteIcon color={quoteColor} />
            </div>

            {/* Testimonial Text - Reduced size and line height */}
            <p className="font-['Plus_Jakarta_Sans'] text-[18px] leading-relaxed font-normal text-[#727272] md:text-[24px]">
              {activeTestimonial.comment ||
                "Leverage agile frameworks to provide is go a robust synopsis is for strategy foster go to Leverage agile m eworks to provide a visa is you in the grobust synopsis for stratey fostr collaborative thinking t o further the"}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full bg-[#D9D9D9]">
                <Image
                  src={activeTestimonial.image || "/images/default-avatar.png"}
                  alt={activeTestimonial.name || "Testimonial avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] leading-tight font-bold text-[#034833] md:text-[20px]">
                  {activeTestimonial.name || "Kathleen Smith"}
                </h3>
                {activeTestimonial.designation && (
                  <span className="font-['Plus_Jakarta_Sans'] text-[14px] leading-tight font-normal text-[#727272]">
                    {activeTestimonial.designation}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex items-center gap-2.5">
              {slides.map((_, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={index}
                    type="button"
                    className={`box-border h-2 w-2 rounded-full ${
                      isActive
                        ? "bg-[#034833]"
                        : "border border-[#034833] bg-transparent"
                    }`}
                    onClick={e => {
                      e.stopPropagation();
                      handleDotClick(index);
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
