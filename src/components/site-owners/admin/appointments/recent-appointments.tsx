import { useState } from "react";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
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
  pending: "text-black/60",
  completed: "text-black/40",
  cancelled: "text-black/40",
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

  return (
    <>
      <div className="rounded-lg border border-black/5 bg-white">
        <div className="border-b border-black/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#003d79]">
              Recent Appointments
            </h3>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="group h-auto rounded-md px-3 py-1.5 text-xs font-normal text-black/60 transition-all hover:bg-black/5 hover:text-black"
            >
              <Link
                href="/admin/appointments"
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
                Date & Time
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((appointment: Appointment) => (
              <TableRow
                key={appointment.id}
                onClick={() => openDialog(appointment.id)}
                className="cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
              >
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-normal text-black capitalize">
                    {appointment.full_name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-black/50">
                      {formatDate(appointment.date)}
                    </span>
                    {appointment.time && (
                      <span className="text-xs text-black/40">
                        {appointment.time}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span
                    className={`text-xs font-normal capitalize ${
                      statusStyles[
                        appointment.status as keyof typeof statusStyles
                      ] || "text-black/40"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AppointmentDetailsDialog
        appointments={data?.results || []}
        currentAppointmentId={selectedAppointmentId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAppointmentChange={setSelectedAppointmentId}
      />
    </>
  );
}
