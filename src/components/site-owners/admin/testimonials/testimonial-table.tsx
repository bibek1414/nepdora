import {
  Testimonial,
  TestimonialsTableProps,
} from "@/types/owner-site/admin/testimonial";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";
import { RefreshCw } from "lucide-react";

export const TestimonialsTable = ({
  testimonials,
  onEdit,
  onDelete,
  isLoading,
}: TestimonialsTableProps) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <TableWrapper>
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
          <p className="animate-pulse text-sm text-slate-400">
            Loading testimonials...
          </p>
        </div>
      </TableWrapper>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <TableWrapper>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xl">💬</span>
          </div>
          <h3 className="text-sm font-medium text-slate-900">
            No testimonials found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Add your first testimonial to get started.
          </p>
        </div>
      </TableWrapper>
    );
  }

  return (
    <div className="rounded-lg bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Client
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Comment
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Date Added
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map(testimonial => (
            <TableRow
              key={testimonial.id}
              className="group border-b border-black/5 transition-colors hover:bg-black/2"
            >
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-normal text-black">
                    {testimonial.name}
                  </span>
                  <span className="text-xs text-black/50">
                    {testimonial.designation}
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-md px-6 py-4">
                <p className="line-clamp-2 text-xs text-black/50">
                  {testimonial.comment}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="text-xs text-black/40">
                  {formatDate(testimonial.created_at)}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons
                  onEdit={() => onEdit(testimonial)}
                  onDelete={() => onDelete(testimonial.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
