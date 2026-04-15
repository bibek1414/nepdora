import { BestOfFooter } from "@/components/marketing/layout/best-of-footer";

export default function BestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="grow">{children}</main>
      <BestOfFooter />
    </div>
  );
}
