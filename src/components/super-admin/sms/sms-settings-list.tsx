"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncer } from "@/hooks/use-debouncer";
import { useTenantsSMSSettings } from "@/hooks/super-admin/use-sms";
import { SMSSettingsTable } from "./sms-settings-table";
import { AddCreditDialog } from "./add-credit-dialog";
import Pagination from "@/components/ui/pagination";

export function SMSSettingsList() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncer(searchTerm, 500);

  const { data, isLoading } = useTenantsSMSSettings(page, debouncedSearch);

  // Modal state
  const [selectedTenant, setSelectedTenant] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleAddCredit = (id: number, name: string) => {
    setSelectedTenant({ id, name });
  };

  const results = data?.results || [];
  const totalPages = Math.ceil((data?.count || 0) / 10); // Assume page size 10 from API

  return (
    <div className="space-y-6 pb-20">
      {/* Header section with search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              SMS Management
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Control and top up SMS credits for all tenants
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tenant by name..."
            className="-sm h-11 border-slate-200 bg-white pl-10 placeholder:text-slate-400 focus:ring-slate-900"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
      </div>

      {/* Table view */}
      <SMSSettingsTable
        settings={results}
        onAddCredit={handleAddCredit}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modals */}
      <AddCreditDialog
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        tenantId={selectedTenant?.id || null}
        tenantName={selectedTenant?.name || null}
      />
    </div>
  );
}
