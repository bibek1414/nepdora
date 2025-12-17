import { useState } from "react";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, ChevronRight, CalendarDays } from "lucide-react";
import { Appointment } from "@/types/owner-site/admin/appointment";
import Link from "next/link";
import AppointmentDetailsDialog from "./appointment-details-dialog";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
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
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Recent Appointments
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
        <AlertDescription>Failed to load appointments.</AlertDescription>
      </Alert>
    );
  }

  if (!data?.results?.length) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground py-10 text-center text-sm">
          No recent appointments found.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-muted-foreground h-5 w-5" />
            <CardTitle className="text-lg font-semibold">
              Recent Appointments
            </CardTitle>
          </div>
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
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-border divide-y">
            {data.results.map((appointment: Appointment) => (
              <div
                key={appointment.id}
                onClick={() => openDialog(appointment.id)}
                className="hover:bg-accent/50 flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground font-medium">
                    {appointment.full_name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3">
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {formatDate(appointment.date)}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {appointment.time || "—"}
                    </span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`text-xs font-medium capitalize ${
                    statusStyles[
                      appointment.status as keyof typeof statusStyles
                    ] || "border-gray-200 bg-gray-100 text-gray-600"
                  }`}
                >
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
