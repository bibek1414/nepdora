import AppointmentList from "@/components/site-owners/admin/appointments/appointment-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Appointment Management",
    pageDescription:
      "Manage appointments efficiently in {storeName}. View, update, and organize all customer appointments from the admin dashboard.",
    pageRoute: "/admin/appointments",
  });
}

const AppointmentsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <AppointmentList />
    </div>
  );
};

export default AppointmentsPage;
