import React from "react";
import Image from "next/image";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { Star, Quote } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
interface TestimonialCard13Props {
  testimonial: Testimonial;
  secondaryColor?: string;
  onClick?: () => void;
}

export const TestimonialCard13: React.FC<TestimonialCard13Props> = ({
  testimonial,
  secondaryColor = "#b2f068",
  onClick,
}) => {
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
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };
  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/20"
      onClick={onClick}
      style={{
        background: theme.colors.primary,
      }}
    >
      {/* Quote Icon Decoration */}
      <div className="absolute top-6 right-8 opacity-10">
        <Quote size={60} className="text-white" />
      </div>

      {/* Stars */}
      <div className="mb-6 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-current"
            style={{ color: i < 5 ? secondaryColor : "transparent" }}
          />
        ))}
      </div>

      {/* Content */}
      <p className="relative z-10 mb-8 flex-1 text-lg leading-relaxed text-gray-200 italic">
        &quot;{testimonial.comment}&quot;
      </p>

      {/* Author Profile */}
      <div className="mt-auto flex items-center gap-4 border-t border-white/5 pt-6">
        <div
          className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2"
          style={{ borderColor: secondaryColor }}
        >
          <Image
            src={testimonial.image || "/images/default-avatar.png"}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-lg leading-tight font-bold text-white">
            {testimonial.name}
          </h4>
          <p className="mt-1 text-xs font-medium tracking-widest text-gray-400 uppercase">
            {testimonial.designation || "Verified Customer"}
          </p>
        </div>
      </div>
    </div>
  );
};
