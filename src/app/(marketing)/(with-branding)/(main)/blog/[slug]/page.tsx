import { BlogDetailView } from "@/components/marketing/blog/blog-detail-view";
import { marketingBlogApi } from "@/services/api/marketing/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactSection from "@/components/marketing/contact-us/contact-us";
import { JsonLd } from "@/components/shared/json-ld";
import { SITE_NAME, absoluteUrl } from "@/lib/seo";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering to prevent static-to-dynamic runtime errors
export const dynamic = "force-dynamic";

import { buildMarketingMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await marketingBlogApi.getBlogBySlug(slug);

    return buildMarketingMetadata({
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.title,
      path: `/blog/${blog.slug}`,
      image: blog.thumbnail_image || undefined,
      keywords: blog.tags?.map(t => t.name) || [],
    });
  } catch (error) {
    // Fallback metadata if blog fetch fails
    return buildMarketingMetadata({
      title: "Blog Post | Nepdora",
      description: "Read our latest blog post on Nepdora",
      path: `/blog/${slug}`,
    });
  }
}

import { DetailSidebar } from "@/components/marketing/blog/sidebar";

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    const [blog, recentPosts] = await Promise.all([
      marketingBlogApi.getBlogBySlug(slug),
      marketingBlogApi.getRecentBlogs(),
    ]);

    const blogPostingSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.meta_description || blog.title,
      image: blog.thumbnail_image,
      author: {
        "@type": "Organization",
        name: SITE_NAME,
        url: absoluteUrl(),
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/nepdora-logooo.svg"),
        },
      },
      datePublished: blog.created_at,
      dateModified: blog.updated_at,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": absoluteUrl(`/blog/${blog.slug}`),
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: absoluteUrl(),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: absoluteUrl("/blog"),
        },
        {
          "@type": "ListItem",
          position: 3,
          name: blog.title,
          item: absoluteUrl(`/blog/${blog.slug}`),
        },
      ],
    };

    return (
      <>
        <JsonLd id="blog-posting-schema" data={blogPostingSchema} />
        <JsonLd id="breadcrumb-schema" data={breadcrumbSchema} />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12 lg:flex-row">
            {/* Blog Post Content */}
            <div className="flex-1">
              <BlogDetailView blog={blog} />
            </div>
          </div>
        </div>
        <ContactSection />
      </>
    );
  } catch (error) {
    notFound();
  }
}
