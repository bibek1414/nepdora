import { Metadata } from "next";
import PopupLeadsClient from "./popup-leads-client";

export const metadata: Metadata = {
  title: "Popup Leads | Superadmin",
  description: "Manage popup form submissions from the marketing site.",
};

export default function PopupLeadsPage() {
  return <PopupLeadsClient />;
}
