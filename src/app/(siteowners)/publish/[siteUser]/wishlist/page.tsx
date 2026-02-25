import WishlistPage from "@/components/customer/wish-list/wish-list";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

// Dynamic metadata for Wishlist page
export async function generateMetadata(): Promise<Metadata> {
  return generatePublishPageMetadata({
    pageName: "Wishlist",
    pageDescription:
      "View and manage your wishlist for {storeName}. Keep track of products you love and plan future purchases.",
    pageRoute: "/wishlist",
  });
}

export default function WishListUserPage() {
  return <WishlistPage />;
}

