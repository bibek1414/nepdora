import { useState } from "react";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, MessageSquare } from "lucide-react";
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
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Recent Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
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
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-50" />
          No inquiries yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-muted-foreground h-5 w-5" />
            <CardTitle className="text-lg font-semibold">
              Recent Inquiries
            </CardTitle>
          </div>
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-border divide-y">
            {data.results.map((c: Contact) => (
              <div
                key={c.id}
                onClick={() => openDialog(c.id)}
                className="hover:bg-accent/50 flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground font-medium">{c.name}</p>
                    {/* Status logic can be added here if backend supports it */}
                  </div>
                  <p className="text-muted-foreground truncate text-sm">
                    {c.message || "—"}
                  </p>
                </div>
                <div className="bg-muted/50 text-muted-foreground flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(c.created_at)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
