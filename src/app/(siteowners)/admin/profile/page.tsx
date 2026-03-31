import { redirect } from "next/navigation";

const AdminProfile = () => {
  redirect("/admin/settings/account");
};

export default AdminProfile;
