import { BestOfFooter } from "@/components/marketing/layout/best-of-footer";

export default function BestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="grow">
        {children}
      </main>
      <BestOfFooter />
    </div>
  );
}
