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
import { Button } from "@/components/ui/button";
import { Portfolio } from "@/types/owner-site/admin/portfolio";
import { FolderOpen, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PortfoliosTableProps {
  portfolios: Portfolio[];
  onEdit: (portfolio: Portfolio) => void;
  onDelete: (portfolio: Portfolio) => void;
  isLoading: boolean;
}

const PortfoliosTable: React.FC<PortfoliosTableProps> = ({
  portfolios,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <TableWrapper>
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
          <p className="animate-pulse text-sm text-slate-400">
            Loading portfolios...
          </p>
        </div>
      </TableWrapper>
    );
  }

  if (portfolios.length === 0) {
    return (
      <TableWrapper>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <FolderOpen className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-900">
            No portfolios found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Get started by creating your first portfolio item.
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
              Project Info
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Category
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Created
            </TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolios.map(portfolio => (
            <TableRow
              key={portfolio.id}
              className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
            >
              <TableCell className="px-6 py-4">
                <TableUserCell
                  imageSrc={portfolio.thumbnail_image || undefined}
                  fallback={portfolio.title.substring(0, 2).toUpperCase()}
                  title={portfolio.title}
                  subtitle={portfolio.slug}
                />
              </TableCell>
              <TableCell className="px-6 py-4">
                <Badge
                  variant="secondary"
                  className="rounded-md bg-slate-100 font-medium text-slate-600 hover:bg-slate-200"
                >
                  {portfolio.category.name}
                </Badge>
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-slate-500">
                {new Date(portfolio.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons
                  onEdit={() => onEdit(portfolio)}
                  onDelete={() => onDelete(portfolio)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default PortfoliosTable;
