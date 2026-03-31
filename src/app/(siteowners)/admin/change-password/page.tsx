import { redirect } from "next/navigation";

export default function ChangePasswordPage() {
  redirect("/admin/settings/account");
}
