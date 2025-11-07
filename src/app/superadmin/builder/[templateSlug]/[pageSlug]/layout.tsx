import AuthWrapper from "@/components/super-admin/auth-wrapper";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      {/* Builder gets full screen without sidebar/header */}
      <div className="min-h-screen bg-white">{children}</div>
    </AuthWrapper>
  );
}
