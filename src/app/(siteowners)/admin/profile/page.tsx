import React from "react";
import { ProfileForm } from "@/components/site-owners/admin/profile/profile-form";

const AdminProfile = () => {
  return (
    <div className="mx-auto bg-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and personal information.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
};

export default AdminProfile;
