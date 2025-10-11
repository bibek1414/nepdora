import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const SQRT_5000 = Math.sqrt(5000);

interface TestimonialCard6Props {
  testimonials: Testimonial[];
  onClick?: (testimonial: Testimonial) => void;
}

interface StaggeredCardProps {
  position: number;
  testimonial: Testimonial & { tempId: number };
  handleMove: (steps: number) => void;
  cardSize: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themeColors: any;
}

const StaggeredCard: React.FC<StaggeredCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
  themeColors,
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute top-1/2 left-1/2 cursor-pointer border-2 p-6 transition-all duration-500 ease-in-out sm:p-8",
        isCenter ? "z-10" : "hover:border-opacity-50 z-0"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        backgroundColor: isCenter
          ? themeColors.primary
          : themeColors.background,
        color: isCenter ? themeColors.primaryForeground : themeColors.text,
        borderColor: isCenter
          ? themeColors.primary
          : themeColors.border || "#E5E7EB",
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? `0px 8px 0px 4px ${themeColors.border || "#E5E7EB"}`
          : "0px 0px 0px 0px transparent",
      }}
    >
      {/* Decorative corner line */}
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
          backgroundColor: themeColors.border || "#E5E7EB",
        }}
      />

      {/* Profile Image */}
      <div className="relative mb-4 h-12 w-12 overflow-hidden sm:h-14 sm:w-12">
        <Image
          src={testimonial.image || "/images/default-avatar.png"}
          alt={testimonial.name}
          fill
          className="object-cover object-top"
          style={{
            boxShadow: `3px 3px 0px ${themeColors.background}`,
          }}
        />
      </div>

      {/* Testimonial Text */}
      <blockquote className="mb-4 line-clamp-4 text-sm font-medium sm:text-base lg:text-lg">
        &quot;{testimonial.comment}&quot;
      </blockquote>

      {/* Customer Info */}
      <div
        className="absolute right-6 bottom-6 left-6 text-xs italic sm:right-8 sm:bottom-8 sm:left-8 sm:text-sm"
        style={{
          color: isCenter
            ? `${themeColors.primaryForeground}CC`
            : themeColors.mutedForeground || "#6B7280",
        }}
      >
        <p className="font-semibold">- {testimonial.name}</p>
        {testimonial.designation && (
          <p className="mt-1">{testimonial.designation}</p>
        )}
      </div>
    </div>
  );
};

export const TestimonialCard6: React.FC<TestimonialCard6Props> = ({
  testimonials,
  onClick,
}) => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(
    testimonials.map((t, idx) => ({ ...t, tempId: idx }))
  );

  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
      border: "#E5E7EB",
      mutedForeground: "#6B7280",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);

    // Trigger onClick for center card if provided
    if (onClick && steps !== 0) {
      const centerIndex = Math.floor(newList.length / 2);
      onClick(newList[centerIndex]);
    }
  };

  useEffect(() => {
    // Update testimonials list when prop changes
    setTestimonialsList(testimonials.map((t, idx) => ({ ...t, tempId: idx })));
  }, [testimonials]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Show message if no testimonials
  if (testimonials.length === 0) {
    return (
      <div
        className="relative flex w-full items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900"
        style={{ height: 600 }}
      >
        <p className="text-gray-500 dark:text-gray-400">
          No testimonials available
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-50 dark:bg-gray-900"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <StaggeredCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            themeColors={theme.colors}
          />
        );
      })}

      {/* Navigation Buttons */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-colors sm:h-14 sm:w-14 sm:text-2xl",
            "border-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          )}
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.color = theme.colors.primaryForeground;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = theme.colors.background;
            e.currentTarget.style.color = theme.colors.text;
          }}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center text-xl transition-colors sm:h-14 sm:w-14 sm:text-2xl",
            "border-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          )}
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme.colors.primary;
            e.currentTarget.style.color = theme.colors.primaryForeground;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = theme.colors.background;
            e.currentTarget.style.color = theme.colors.text;
          }}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
