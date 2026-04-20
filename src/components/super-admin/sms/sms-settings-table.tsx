"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, User, Mail, Phone, Globe } from "lucide-react";
import { TenantSMSSettings } from "@/types/super-admin/sms";
import { Skeleton } from "@/components/ui/skeleton";

interface SMSSettingsTableProps {
  settings: TenantSMSSettings[];
  onAddCredit: (tenantId: number, tenantName: string) => void;
  isLoading: boolean;
}

export function SMSSettingsTable({
  settings,
  onAddCredit,
  isLoading,
}: SMSSettingsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (settings.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-slate-500">
        <Globe className="mb-2 h-10 w-10 text-slate-300" />
        <p className="font-medium text-slate-600">No tenants found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="w-[250px]">Tenant</TableHead>
            <TableHead>Owner Info</TableHead>
            <TableHead>SMS Status</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map(item => (
            <TableRow
              key={item.tenant.id}
              className="transition-colors hover:bg-slate-50/50"
            >
              <TableCell>
                <div className="flex flex-col">
                  <span className="w-fit cursor-default border-b border-transparent font-semibold text-slate-900 transition-all hover:border-slate-900">
                    {item.tenant.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="h-3 w-3" />
                    <span>{item.tenant.owner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="h-3 w-3" />
                    <span>{item.tenant.owner.phone_number || "N/A"}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Badge
                    variant={item.sms_enabled ? "default" : "secondary"}
                    className={
                      item.sms_enabled
                        ? "w-fit border-none bg-green-100 text-green-700 hover:bg-green-100"
                        : "w-fit"
                    }
                  >
                    System: {item.sms_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge
                    variant={
                      item.delivery_sms_enabled ? "default" : "secondary"
                    }
                    className={
                      item.delivery_sms_enabled
                        ? "w-fit border-none bg-blue-100 text-blue-700 hover:bg-blue-100"
                        : "w-fit"
                    }
                  >
                    Delivery:{" "}
                    {item.delivery_sms_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900">
                    {item.sms_credit.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">
                    Available Credits
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  onClick={() => onAddCredit(item.tenant.id, item.tenant.name)}
                  className="h-8 gap-1.5 bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Credits
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
