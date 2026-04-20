"use client";

import React, { useState } from "react";
import { useSMSHistory } from "@/hooks/owner-site/admin/use-sms";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Phone,
  History as HistoryIcon,
  MessageSquare,
  Clock,
  CreditCard,
} from "lucide-react";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { SMSDetailsDialog } from "@/components/site-owners/admin/sms/sms-details-dialog";
import { htmlToPlainText } from "@/utils/html-sanitizer";

interface SMSSendingHistoryProps {
  showTitle?: boolean;
}

export function SMSSendingHistory({
  showTitle = true,
}: SMSSendingHistoryProps) {
  const [page, setPage] = useState(1);
  const [selectedSMS, setSelectedSMS] = useState<any | null>(null);

  const { data: history, isLoading } = useSMSHistory(page);

  const historyItems = history?.results || [];
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil((history?.count || 0) / PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#003d79]">Sending History</h2>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-black/5 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/5 bg-slate-50/50">
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Receiver
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Message
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Credits
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Sent At
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyItems.length > 0 ? (
              historyItems.map(item => (
                <TableRow
                  key={item.id}
                  className="group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
                  onClick={() => setSelectedSMS(item)}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <Phone className="h-4 w-4 text-black/20" />
                      {item.receiver_number}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[400px] px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0 text-black/20" />
                      <p className="line-clamp-1 text-sm text-gray-600">
                        {htmlToPlainText(item.message)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 font-medium text-gray-900">
                      <CreditCard className="h-4 w-4 text-black/20" />
                      {item.credits_used}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant={
                        item.status === "200" ? "default" : "destructive"
                      }
                      className={
                        item.status === "200"
                          ? "border-none bg-green-100 text-[10px] text-green-700 shadow-none hover:bg-green-100"
                          : "text-[10px]"
                      }
                    >
                      {item.status === "200" ? "Delivered" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-black/20" />
                      {format(new Date(item.sent_at), "MMM d, yyyy · p")}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <HistoryIcon className="h-8 w-8 text-slate-300" />
                    <p className="font-medium text-slate-500">
                      No sending history found.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="border-t border-black/5 px-6 py-4">
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <SMSDetailsDialog
        item={selectedSMS}
        isOpen={!!selectedSMS}
        onClose={() => setSelectedSMS(null)}
      />
    </div>
  );
}
