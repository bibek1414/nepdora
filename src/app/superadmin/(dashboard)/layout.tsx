import { Suspense } from "react";
import Sidebar from "@/components/super-admin/sidebar/sidebar";
import AuthWrapper from "@/components/super-admin/auth-wrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      }
    >
      <AuthWrapper>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 bg-white p-6">{children}</main>
        </div>
      </AuthWrapper>
    </Suspense>
  );
}
