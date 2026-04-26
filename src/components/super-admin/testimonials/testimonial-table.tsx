import { toast } from "sonner";
import {
  Testimonial,
  TestimonialsTableProps,
} from "@/types/owner-site/admin/testimonial";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export const TestimonialsTable = ({
  testimonials,
  onEdit,
  onDelete,
  isLoading,
}: TestimonialsTableProps) => {
  const handleDeleteClick = (
    testimonial: Testimonial,
    e: React.MouseEvent
  ): void => {
    e.stopPropagation(); // Prevent triggering the row click event
    onDelete(testimonial);
  };

  const handleRowClick = (testimonial: Testimonial): void => {
    onEdit(testimonial);
  };

  const handleEditClick = (
    testimonial: Testimonial,
    e: React.MouseEvent
  ): void => {
    e.stopPropagation(); // Prevent triggering the row click event
    onEdit(testimonial);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-600 sm:h-8 sm:w-8"></div>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="text-base text-gray-500 sm:text-lg">
          No testimonials found
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Add your first testimonial to get started
        </div>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden lg:table-cell">Designation</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead className="hidden sm:table-cell">Date Added</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map(testimonial => (
            <TableRow
              key={testimonial.id}
              className="cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => handleRowClick(testimonial)}
            >
              <TableCell className="hidden md:table-cell">
                <div className="mb-2 shrink-0">
                  {testimonial.image ? (
                    <Image
                      unoptimized
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={60}
                      height={48}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 xl:h-12 xl:w-12">
                      <span className="text-sm font-medium text-gray-700">
                        {testimonial.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium text-gray-900">
                  {testimonial.name}
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {testimonial.designation && (
                  <div className="text-sm font-medium text-gray-900">
                    {testimonial.designation}
                  </div>
                )}
              </TableCell>
              <TableCell className="whitespace-normal">
                <div className="max-w-[200px] text-sm leading-relaxed text-gray-900 sm:max-w-xs xl:max-w-md">
                  {testimonial.comment}
                </div>
              </TableCell>
              <TableCell className="hidden text-sm text-gray-500 sm:table-cell">
                {formatDate(testimonial.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => handleEditClick(testimonial, e)}
                    className="hover:text-gray-90 text-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => handleDeleteClick(testimonial, e)}
                    className="text-red-600 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
