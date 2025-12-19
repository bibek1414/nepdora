import { useState } from "react";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import { Badge } from "@/components/ui/badge";
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
import { ChevronRight } from "lucide-react";
import { Appointment } from "@/types/owner-site/admin/appointment";
import Link from "next/link";
import AppointmentDetailsDialog from "./appointment-details-dialog";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function RecentAppointments() {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, error } = useGetAppointments({
    page: 1,
    page_size: 5,
  });

  const openDialog = (id: number) => {
    setSelectedAppointmentId(id);
    setIsDialogOpen(true);
  };

  const formatDate = (date?: string | null) =>
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
          <h3 className="text-lg font-semibold">Recent Appointments</h3>
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
        <AlertDescription>Failed to load appointments.</AlertDescription>
      </Alert>
    );
  }

  if (!data?.results?.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Appointments</h3>
        </div>
        <div className="text-muted-foreground py-10 text-center text-sm">
          No recent appointments found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-100 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Appointments</h3>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 bg-gray-50">
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Name
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Date
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Time
              </TableHead>
              <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((appointment: Appointment) => (
              <TableRow
                key={appointment.id}
                onClick={() => openDialog(appointment.id)}
                className="group cursor-pointer border-b border-slate-50 transition-colors hover:bg-gray-50"
              >
                <TableCell className="px-6 py-4">
                  <span className="font-medium text-slate-900 capitalize">
                    {appointment.full_name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="whitespace-nowrap text-slate-500">
                    {formatDate(appointment.date)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-slate-600">
                    {appointment.time || "—"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Badge
                    variant="outline"
                    className={`ml-auto inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                      statusStyles[
                        appointment.status as keyof typeof statusStyles
                      ] || "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {appointment.status}
                  </Badge>
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
              <Link
                href="/admin/appointments"
                className="flex items-center gap-1"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <AppointmentDetailsDialog
        appointments={data.results}
        currentAppointmentId={selectedAppointmentId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAppointmentChange={setSelectedAppointmentId}
      />
    </>
  );
}
