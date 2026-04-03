import { Suspense } from "react";
import Blogs, { BlogCardSkeleton } from "@/components/marketing/blog/blogs";
import { Metadata } from "next";
import ContactUs from "@/components/marketing/contact-us/contact-us";
import { JsonLd } from "@/components/shared/json-ld";
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog | Nepdora — Digital Growth & Website Insights",
  description:
    "Stay updated with the latest trends in web development, e-commerce, and digital marketing in Nepal. Tutorials, tips, and stories from the Nepdora team.",
  keywords: [
    "Nepdora blog",
    "web development insights Nepal",
    "ecommerce tips Nepal",
    "digital marketing Nepal",
  ],
  alternates: {
    canonical: absoluteUrl("/blog"),
  },
  openGraph: {
    title: "Blog | Nepdora — Digital Growth & Website Insights",
    description:
      "Stay updated with the latest trends in web development, e-commerce, and digital marketing in Nepal. Tutorials, tips, and stories from the Nepdora team.",
    url: absoluteUrl("/blog"),
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Nepdora Blog - Insights for digital growth",
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Nepdora — Digital Growth & Website Insights",
    description:
      "Stay updated with the latest trends in web development, e-commerce, and digital marketing in Nepal.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Nepdora Blog",
  description:
    "The official blog of Nepdora, providing insights on web development and digital marketing in Nepal.",
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE,
    },
  },
  url: absoluteUrl("/blog"),
};

import { marketingBlogApi } from "@/services/api/marketing/blog";

const BlogPage = async () => {
  const blogData = await marketingBlogApi.getBlogs({ page_size: 12 });
  const blogs = blogData.results || [];

  const enhancedBlogSchema = {
    ...blogSchema,
    blogPost: blogs.map(blog => ({
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.meta_description || "",
      url: absoluteUrl(`/blog/${blog.slug}`),
      datePublished: blog.created_at,
      author: {
        "@type": "Person",
        name: blog.author
          ? `${blog.author.first_name} ${blog.author.last_name}`.trim()
          : "Nepdora Team",
      },
    })),
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
    ],
  };

  return (
    <div className="">
      <JsonLd id="blog-schema" data={enhancedBlogSchema} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema} />
      <section className="mb-20 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Main Feed */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map(n => (
                  <BlogCardSkeleton key={n} />
                ))}
              </div>
            }
          >
            <Blogs initialData={blogData} />
          </Suspense>
        </div>
      </section>
      <ContactUs />
    </div>
  );
};

export default BlogPage;
