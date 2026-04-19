import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Superadmin | Nepdora Superadmin",
  description: "Nepdora platform administration.",
};

export default function SuperAdmin() {
  redirect("/superadmin/login");
}
