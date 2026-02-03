import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
          <p className="text-muted-foreground">
            Update your password to keep your account secure.
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
