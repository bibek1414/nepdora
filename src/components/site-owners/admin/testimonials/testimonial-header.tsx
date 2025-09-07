import { TestimonialsHeaderProps } from "@/types/owner-site/testimonial";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const TestimonialsHeader = ({
  onAdd,
  testimonialsCount,
}: TestimonialsHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Testimonials
        </h1>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Manage customer testimonials ({testimonialsCount} total)
        </p>
      </div>
      <Button
        onClick={onAdd}
        className="flex w-full items-center justify-center space-x-2 bg-gray-600 text-white hover:bg-gray-700 sm:w-auto"
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Add Testimonial</span>
      </Button>
    </div>
  );
};
