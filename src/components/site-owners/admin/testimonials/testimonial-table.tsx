import { useState } from "react";
import { toast } from "sonner";
import {
  Testimonial,
  TestimonialsTableProps,
} from "@/types/owner-site/testimonial";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export const TestimonialsTable = ({
  testimonials,
  onEdit,
  onDelete,
  isLoading,
}: TestimonialsTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] =
    useState<Testimonial | null>(null);

  const handleDeleteClick = (
    testimonial: Testimonial,
    e: React.MouseEvent
  ): void => {
    e.stopPropagation(); // Prevent triggering the row click event
    setTestimonialToDelete(testimonial);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (): void => {
    if (testimonialToDelete) {
      onDelete(testimonialToDelete.id);
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
      toast.success("Testimonial deleted successfully");
    }
  };

  const handleDeleteCancel = (): void => {
    setDeleteDialogOpen(false);
    setTestimonialToDelete(null);
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

  const truncateText = (text: string, maxLength: number = 60): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
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
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {testimonialToDelete?.name}&apos;s
              testimonial? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date Added</TableHead>
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
                <TableCell>
                  <div className="mb-2 h-10 w-10 flex-shrink-0 xl:h-12 xl:w-12">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover xl:h-12 xl:w-12"
                        style={{ width: "auto", height: "auto" }}
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
                <TableCell>
                  {testimonial.designation && (
                    <div className="text-sm font-medium text-gray-900">
                      {testimonial.designation}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="max-w-xs text-sm leading-relaxed text-gray-900 xl:max-w-md">
                    {truncateText(testimonial.comment, 80)}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
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
    </>
  );
};
