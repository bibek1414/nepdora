import { TestimonialsHeaderProps } from "@/types/owner-site/admin/testimonial";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const TestimonialsHeader = ({
  onAdd,
  testimonialsCount,
}: TestimonialsHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Testimonials
        </h1>
        <p className="text-sm text-slate-500">
          Manage your client testimonials.{" "}
          <span className="font-semibold text-slate-700">
            {testimonialsCount}
          </span>{" "}
          {testimonialsCount === 1 ? "testimonial" : "testimonials"} available.
        </p>
      </div>
      <Button
        onClick={onAdd}
        className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Testimonial
      </Button>
    </div>
  );
};
