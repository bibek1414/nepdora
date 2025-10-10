import { TestimonialsHeaderProps } from "@/types/owner-site/admin/testimonial";
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
      </div>
      <Button
        onClick={onAdd}
        className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        <span>Add Testimonial</span>
      </Button>
    </div>
  );
};
