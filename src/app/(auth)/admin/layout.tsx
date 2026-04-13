import Header from "@/components/marketing/layout/header";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Header />
      {children}
    </div>
  );
}
