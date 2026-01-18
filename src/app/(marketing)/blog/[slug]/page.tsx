import { BlogDetailView } from "@/components/marketing/blog/blog-detail-view";
import { marketingBlogApi } from "@/services/api/marketing/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactSection from "@/components/marketing/contact-us/contact-us";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await marketingBlogApi.getBlogBySlug(slug);

    const title = blog.meta_title || blog.title;
    const description = blog.meta_description || blog.title;
    const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://www.nepdora.com"}/blog/${blog.slug}`;
    const imageUrl = blog.thumbnail_image || "";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: "Nepdora",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 600,
                alt: blog.thumbnail_image_alt_description || blog.title,
              },
            ]
          : [],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    // Fallback metadata if blog fetch fails
    return {
      title: "Blog Post | Nepdora",
      description: "Read our latest blog post on Nepdora",
    };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;

  try {
    const blog = await marketingBlogApi.getBlogBySlug(slug);
    return (
      <>
        <BlogDetailView blog={blog} />
        <ContactSection />
      </>
    );
  } catch (error) {
    notFound();
  }
}
