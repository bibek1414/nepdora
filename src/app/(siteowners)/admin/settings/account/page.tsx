import React from "react";
import { ProfileForm } from "@/components/site-owners/admin/profile/profile-form";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteAccountButton } from "@/components/site-owners/admin/profile/delete-account-button";

export default function AccountSettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-800 mb-1.5 text-[28px] tracking-tight text-[#0d1117]">
          Account Settings
        </h1>
        <p className="text-sm text-[#5b6e8c]">
          Manage your personal profile, security preferences, and account status
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        {/* Profile Section */}
        <div className="card-premium overflow-hidden rounded-[18px] border border-[#eef2f6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between border-b border-[#f0f2f5] px-6 pt-5 pb-3">
            <div>
              <div className="font-800 flex items-center gap-2.5 text-[16px] text-[#0d1117]">
                <User className="h-4 w-4 text-blue-600" />
                <span>Profile Information</span>
              </div>
              <p className="mt-1 text-[12px] text-[#6c7a91]">
                Update your personal details and contact information
              </p>
            </div>
          </div>
          <div className="p-0">
            <ProfileForm />
          </div>
        </div>

        {/* Security Section */}
        <div className="card-premium overflow-hidden rounded-[18px] border border-[#eef2f6] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.03)] transition-all">
          <div className="flex items-center justify-between border-b border-[#f0f2f5] px-6 pt-5 pb-3">
            <div>
              <div className="font-800 flex items-center gap-2.5 text-[16px] text-[#0d1117]">
                <Lock className="h-4 w-4 text-amber-600" />
                <span>Security</span>
              </div>
              <p className="mt-1 text-[12px] text-[#6c7a91]">
                Change your password and secure your account
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="max-w-2xl">
              <ChangePasswordForm />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-[20px] border border-[#ffdbd4] bg-[#fff6f4] p-6">
          <div className="mb-1.5 flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h4 className="font-800 text-sm text-[#b91c1c]">Danger Zone</h4>
          </div>
          <p className="mb-4 text-[12px] leading-relaxed text-[#9b2c1d]">
            Once you delete your account, all of your store data will be
            permanently removed after 7 days. This action cannot be undone.
          </p>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
