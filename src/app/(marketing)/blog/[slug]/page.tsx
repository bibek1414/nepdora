"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSuperAdminBlog } from "@/hooks/super-admin/use-blogs";
import RecentBlogs from "@/components/marketing/blog/recent-blogs";
import { Calendar, Clock, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "next-share";
import { sanitizeHtmlContent } from "@/utils/html-sanitizer";

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const { data: blog, isLoading, error } = useSuperAdminBlog(slug);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 md:px-8">
        <Skeleton className="mb-6 h-8 w-24" />
        <Skeleton className="mb-8 h-12 w-3/4" />
        <div className="mb-12 flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="mb-12 h-[450px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="mb-4 text-2xl font-bold">Blog not found</h2>
        <Button onClick={() => router.push("/blog")}>Back to Blog</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white">
      <article className="mx-auto max-w-4xl px-6 py-12 md:px-8 md:py-20">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/blog">Blog</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {blog.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-6 flex flex-wrap gap-2">
            {blog.tags?.map(tag => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="border-none bg-slate-100 text-slate-900"
              >
                {tag.name}
              </Badge>
            ))}
          </div>

          <h1 className="mb-8 text-3xl leading-[1.15] font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-black/5 pb-8">
            <div className="flex items-center gap-6 text-sm text-black/60">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 uppercase">
                  {blog.author?.first_name?.[0] || "N"}
                </div>
                <span>
                  By{" "}
                  {blog.author?.first_name
                    ? `${blog.author.first_name} ${blog.author.last_name || ""}`
                    : "Nepdora Team"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.created_at)}
              </div>
              {blog.time_to_read && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Clock className="h-4 w-4" />
                  {blog.time_to_read}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <FacebookShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                quote={blog.title}
                hashtag={"#nepdora"}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={blog.title}
              >
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
              >
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <WhatsappShareButton
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={blog.title}
                separator=":: "
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.thumbnail_image && (
          <div className="relative mb-12 h-[300px] overflow-hidden rounded-2xl sm:h-[450px]">
            <Image
              src={blog.thumbnail_image}
              alt={blog.thumbnail_image_alt_description || blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-slate prose-lg prose-headings:text-slate-900 prose-a:text-[#3b82f6] prose-img:rounded-2xl max-w-none"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtmlContent(blog.content),
          }}
        />
      </article>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Continue Reading
            </h2>
            <p className="mt-4 text-slate-600">
              Discover more stories from the Nepdora community.
            </p>
          </div>
          <RecentBlogs />
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
