import AppointmentReasonsList from "@/components/site-owners/admin/appointments/appointment-reasons-list";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Appointment Reasons Management",
    pageDescription:
      "Manage appointment reasons in {storeName}. Create, edit, and organize reasons customers can select when booking appointments.",
    pageRoute: "/admin/appointments/reasons",
  });
}

const AppointmentReasonsPage = () => {
  return (
    <div className="container mx-auto p-6">
      <AppointmentReasonsList />
    </div>
  );
};

export default AppointmentReasonsPage;
