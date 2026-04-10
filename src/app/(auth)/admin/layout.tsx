import { AuthHeader } from "@/components/auth/auth-header";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <AuthHeader />
      {children}
    </div>
  );
}
