import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TestimonialCard3Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard3: React.FC<TestimonialCard3Props> = ({
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
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
    >
      <CardContent className="p-8">
        <div className="relative">
          <Quote
            className="text-primary/20 absolute -top-2 -left-2 h-12 w-12"
            style={{
              color: `${theme.colors.primary}33`,
              fontFamily: theme.fonts.heading,
            }}
          />

          <blockquote className="relative z-10 mb-6 leading-relaxed font-medium text-gray-800">
            &quot;{testimonial.comment}&quot;
          </blockquote>

          <div className="border-t pt-4">
            <div className="flex items-center">
              <div className="relative mr-4 h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={testimonial.image || "/images/default-avatar.png"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  {testimonial.name}
                </h4>
                <p
                  className="text-gray-600"
                  style={{
                    color: theme.colors.secondary,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  {testimonial.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
