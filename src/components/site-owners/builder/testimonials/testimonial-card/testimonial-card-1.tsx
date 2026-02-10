import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
interface TestimonialCard1Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard1: React.FC<TestimonialCard1Props> = ({
  testimonial,
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
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <Quote
          className="mb-4 h-8 w-8"
          style={{
            color: theme.colors.primary,
            fontFamily: theme.fonts.heading,
          }}
        />

        <blockquote className="mb-6 leading-relaxed text-gray-700 italic">
          &quot;{testimonial.comment}&quot;
        </blockquote>

        <div className="flex items-center justify-center">
          <div className="relative mr-3 h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={testimonial.image || "/images/default-avatar.png"}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="">
            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
            <p
              className="text-sm text-gray-600"
              style={{
                color: theme.colors.secondary,
                fontFamily: theme.fonts.heading,
              }}
            >
              {testimonial.designation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
