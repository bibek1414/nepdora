import { useState } from "react";
import { Domain } from "@/types/super-admin/domain";
import { Trash2, ExternalLink, Loader2, LogIn } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTemplateToken } from "@/hooks/super-admin/components/use-template-token";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";

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
  const [loggingInTenantId, setLoggingInTenantId] = useState<number | null>(
    null
  );
  const templateTokenMutation = useTemplateToken();

  const handleFrontendUrlClick = (
    tenantSchemaName: string,
    domainId: number
  ) => {
    const url = `https://${tenantSchemaName}.nepdora.com`;
    window.open(url, "_blank", "noopener,noreferrer");
    onFrontendUrlClick(tenantSchemaName);
  };

  const setCrossDomainCookie = (
    name: string,
    value: string,
    days: number = 7
  ) => {
    const baseDomain = siteConfig.baseDomain;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; domain=.${baseDomain}; path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;
  };

  const handleTemplateLogin = async (domain: Domain) => {
    try {
      setLoggingInTenantId(domain.tenant.id);

      const response = await templateTokenMutation.mutateAsync({
        client_id: domain.tenant.id,
      });

      const userData = {
        user_id: response.owner.id,
        id: response.owner.id,
        email: response.owner.email,
        role: response.owner.role,
        sub_domain: response.client.schema_name,
        domain: response.client.domain,
        store_name: response.client.name,
        has_profile: true,
        has_profile_completed: true,
      };

      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      localStorage.setItem(
        "authTokens",
        JSON.stringify({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        })
      );
      localStorage.setItem("authUser", JSON.stringify(userData));

      setCrossDomainCookie("authToken", response.access_token);
      setCrossDomainCookie("refreshToken", response.refresh_token);
      setCrossDomainCookie("authUser", JSON.stringify(userData));

      toast.success(`Logging into ${domain.tenant.name}...`);

      const isLocalhost = window.location.hostname.includes("localhost");
      let templateUrl: string;

      if (isLocalhost) {
        const port = window.location.port || "3000";
        templateUrl = `http://${response.client.schema_name}.localhost:${port}/admin`;
      } else {
        templateUrl = `https://${response.client.schema_name}.${siteConfig.baseDomain}/admin`;
      }

      const separator = templateUrl.includes("?") ? "&" : "?";
      const finalUrl = `${templateUrl}${separator}auth_token=${encodeURIComponent(
        response.access_token
      )}&refresh_token=${encodeURIComponent(response.refresh_token)}`;

      window.location.href = finalUrl;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to login to tenant:", error);
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to login to tenant"
      );
      setLoggingInTenantId(null);
    }
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
                          handleTemplateLogin(domain);
                        }}
                        className="h-8 w-8 p-0 text-gray-400 transition-colors hover:text-blue-600"
                        title="Open Template"
                        disabled={loggingInTenantId !== null}
                      >
                        {loggingInTenantId === domain.tenant.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <LogIn size={16} />
                        )}
                      </Button>
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
