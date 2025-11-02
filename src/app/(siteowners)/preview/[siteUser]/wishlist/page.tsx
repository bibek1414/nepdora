import WishlistPage from "@/components/customer/wish-list/wish-list";
import { generatePreviewPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generatePreviewPageMetadata({
    pageName: "Wishlist",
    pageDescription:
      "View and manage your wishlist for {storeName}. Keep track of products you love and plan future purchases.",
    pageRoute: "/wishlist",
  });
}

export default function PreviewWishlistPage() {
  return <WishlistPage />;
}
