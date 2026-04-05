"use server";

import { revalidateTag } from "next/cache";
import { getPublishSiteTag } from "@/lib/publish-page-cache";

/**
 * Server action to manually revalidate the cache for a published site.
 * This is called after a successful publish action from the builder.
 */
export async function revalidatePublishCache(siteUser: string) {
  if (!siteUser) return;

  try {
    const siteTag = getPublishSiteTag(siteUser);
    // In Next.js 16, revalidateTag requires a second argument for the revalidation profile.
    // 'max' marks the tag as stale, allowing for background refresh.
    // @ts-ignore - handled by runtime if types are not perfectly updated yet
    revalidateTag(siteTag, "max");
    console.log(`[Revalidation] Successfully revalidated tag: ${siteTag}`);
  } catch (error) {
    console.error(
      `[Revalidation] Failed to revalidate tag for ${siteUser}:`,
      error
    );
  }
}
