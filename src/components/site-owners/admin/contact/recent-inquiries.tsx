import { useState } from "react";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, MessageSquare } from "lucide-react";
import { Contact } from "@/types/owner-site/admin/contact";
import Link from "next/link";
import ContactDetailsDialog from "./contact-details-dialog";

export default function RecentInquiries() {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetContacts({
    page: 1,
    page_size: 5,
  });

  const openDialog = (id: number) => {
    setSelectedContactId(id);
    setIsDialogOpen(true);
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "—";

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Inquiries</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load inquiries.</AlertDescription>
      </Alert>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Inquiries</h3>
        </div>
        <div className="text-muted-foreground py-10 text-center text-sm">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-50" />
          No inquiries yet.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Inquiries</h3>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-gray-50">
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Name
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Contact
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Message
              </TableHead>
              <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((c: Contact) => (
              <TableRow
                key={c.id}
                onClick={() => openDialog(c.id)}
                className="group cursor-pointer border-b border-slate-50 transition-colors hover:bg-gray-50"
              >
                <TableCell className="px-6 py-4">
                  <span className="font-medium text-slate-900 capitalize">
                    {c.name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {c.email && (
                      <span className="text-sm text-slate-600">{c.email}</span>
                    )}
                    {c.phone_number && (
                      <span className="text-sm text-slate-600">
                        {c.phone_number}
                      </span>
                    )}
                    {!c.email && !c.phone_number && (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="max-w-md truncate text-slate-600">
                    {c.message || "—"}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="whitespace-nowrap text-slate-500">
                    {formatDate(c.created_at)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/admin/inquiries" className="flex items-center gap-1">
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <ContactDetailsDialog
        contacts={data.results}
        currentContactId={selectedContactId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContactChange={setSelectedContactId}
      />
    </>
  );
}
