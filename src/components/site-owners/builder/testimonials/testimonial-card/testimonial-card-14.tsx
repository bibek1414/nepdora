import React from "react";
import { Testimonial } from "@/types/owner-site/admin/testimonial";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

interface TestimonialCard14Props {
  testimonial: Testimonial;
  onClick?: () => void;
}

export const TestimonialCard14: React.FC<TestimonialCard14Props> = ({
  testimonial,
  onClick,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      secondary: "#F59E0B",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Splitting comment to get a "summary" if available, otherwise using the whole comment
  const lines = testimonial.comment.split("\n");
  const summary = lines[0];
  const restOfComment = lines.slice(1).join("\n");

  return (
    <div
      className="flex h-full cursor-pointer flex-col rounded-3xl bg-[#F9FAF9] p-8 shadow-sm transition-all duration-300 hover:shadow-md md:p-12"
      onClick={onClick}
    >
      {/* Summary / Headline */}
      <h3 className="mb-8 text-2xl leading-tight font-bold md:text-3xl">
        {summary}
      </h3>

      {/* Main Quote */}
      <div className="mb-auto">
        <p className="text-lg leading-relaxed opacity-80">
          &quot;{restOfComment || testimonial.comment}&quot;
        </p>
      </div>

      {/* Author Info */}
      <div className="mt-12">
        <h4 className="text-lg font-bold">{testimonial.name}</h4>
        <p className="text-base font-medium opacity-60">
          {testimonial.designation}
        </p>
      </div>
    </div>
  );
};
