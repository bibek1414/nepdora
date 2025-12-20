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

  return (
    <>
      <div className="rounded-lg border border-black/5 bg-white">
        <div className="border-b border-black/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#003d79]">
              Recent Inquiries
            </h3>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="group h-auto rounded-md px-3 py-1.5 text-xs font-normal text-black/60 transition-all hover:bg-black/5 hover:text-black"
            >
              <Link
                href="/admin/inquiries"
                className="flex items-center gap-1.5"
              >
                View all
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/5">
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Name
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Contact
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((c: Contact) => (
              <TableRow
                key={c.id}
                onClick={() => openDialog(c.id)}
                className="cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
              >
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-normal text-black capitalize">
                    {c.name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {c.email && (
                      <span className="text-xs text-black/50">{c.email}</span>
                    )}
                    {c.phone_number && (
                      <span className="text-xs text-black/50">
                        {c.phone_number}
                      </span>
                    )}
                    {!c.email && !c.phone_number && (
                      <span className="text-xs text-black/40">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-xs text-black/40">
                    {formatDate(c.created_at)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ContactDetailsDialog
        contacts={data?.results || []}
        currentContactId={selectedContactId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContactChange={setSelectedContactId}
      />
    </>
  );
}
