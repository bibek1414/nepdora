import AuthWrapper from "@/components/super-admin/auth-wrapper";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-white">{children}</div>
    </AuthWrapper>
  );
}
