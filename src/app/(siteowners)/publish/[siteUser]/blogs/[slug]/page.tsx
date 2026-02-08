import React from "react";
import { BlogDetail } from "@/components/site-owners/builder/blog/blog-details";
import { use } from "react";
import { generatePublishPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";
interface BlogPageProps {
  params: Promise<{ siteUser: string; slug: string }>;
}
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { siteUser, slug } = await params;

  return generatePublishPageMetadata({
    pageName: slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    pageDescription: `Read the full blog post: ${slug.replace(/-/g, " ")} on ${siteUser}`,
    pageRoute: `/${siteUser}/blog/${slug}`,
  });
}
export default function ProductPage({ params }: BlogPageProps) {
  const { siteUser, slug } = use(params);

  return <BlogDetail slug={slug} siteUser={siteUser} />;
}
