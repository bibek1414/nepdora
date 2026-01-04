import { Suspense } from "react";
import SuperAdminSidebar from "@/components/super-admin/layout/sidebar";
import SuperAdminHeader from "@/components/super-admin/layout/header";
import AuthWrapper from "@/components/super-admin/auth-wrapper";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthWrapper>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        }
      >
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <SuperAdminSidebar />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <SuperAdminHeader />

            {/* Page Content */}
            <main className="flex-1 overflow-y-auto p-6 pt-20">{children}</main>
          </div>
        </div>
      </Suspense>
    </AuthWrapper>
  );
}
