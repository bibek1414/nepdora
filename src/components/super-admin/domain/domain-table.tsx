import { Domain } from "@/types/super-admin/domain";
import { Trash2, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DomainTableProps {
  domains: Domain[];
  onRowClick: (domain: Domain) => void;
  onEdit: (domain: Domain) => void;
  onDelete: (id: number) => void;
  onFrontendUrlClick: (tenantSchemaName: string) => void;
}
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export default function DomainTable({
  domains,
  onRowClick,
  onEdit,
  onDelete,
  onFrontendUrlClick,
}: DomainTableProps) {
  const handleFrontendUrlClick = (
    tenantSchemaName: string,
    domainId: number
  ) => {
    const url = `https://${tenantSchemaName}.nepdora.com`;
    window.open(url, "_blank", "noopener,noreferrer");
    onFrontendUrlClick(tenantSchemaName);
  };

  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">
              Domain
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Frontend URL
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              Tenant
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Owner</TableHead>
            <TableHead className="font-semibold text-gray-700">
              Created On
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.length > 0 ? (
            domains.map(domain => {
              return (
                <TableRow
                  key={domain.id}
                  className="group cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => onRowClick(domain)}
                >
                  <TableCell className="font-medium text-gray-900">
                    {domain.domain}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="h-auto p-0 font-normal text-blue-600 hover:text-blue-800"
                      onClick={e => {
                        e.stopPropagation();
                        handleFrontendUrlClick(
                          domain.tenant.schema_name,
                          domain.tenant.owner.id
                        );
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {domain.domain}
                        <ExternalLink
                          size={14}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {domain.tenant.name}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate text-gray-600">
                    {domain.tenant.owner.email}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(domain.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          onDelete(domain.id);
                        }}
                        className="h-8 w-8 p-0 text-gray-400 transition-colors hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-gray-400 italic"
              >
                No active domains found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
