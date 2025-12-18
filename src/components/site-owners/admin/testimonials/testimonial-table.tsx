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
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100 hover:bg-transparent">
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Client
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Comment
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Date Added
            </TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map(testimonial => (
            <TableRow
              key={testimonial.id}
              className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
            >
              <TableCell className="px-6 py-4">
                <TableUserCell
                  imageSrc={testimonial.image}
                  fallback={testimonial.name.charAt(0).toUpperCase()}
                  title={testimonial.name}
                  subtitle={testimonial.designation}
                />
              </TableCell>
              <TableCell className="max-w-md px-6 py-4">
                <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {testimonial.comment}
                </p>
              </TableCell>
              <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-500">
                {formatDate(testimonial.created_at)}
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
    </TableWrapper>
  );
};
