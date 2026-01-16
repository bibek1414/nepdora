import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMarketingBlog } from "@/hooks/marketing/use-blogs";
import { sanitizeContent } from "@/utils/html-sanitizer";
import { Loader2 } from "lucide-react";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import { BlogPost } from "@/types/super-admin/blog";

interface BlogDetailViewProps {
  blog: BlogPost;
}

export const BlogDetailView = ({ blog }: BlogDetailViewProps) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")}/blog/${blog.slug}`;

  return (
    <div className="bg-white pt-20 pb-0">
      <div className="container mx-auto mb-12 px-4 md:px-8">
        <nav className="mb-6">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            <li>
              <Link
                href="/"
                className="font-medium transition-colors hover:text-blue-600"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/blog"
                className="font-medium transition-colors hover:text-blue-600"
              >
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="line-clamp-1 text-center font-medium text-gray-900">
              {blog.title}
            </li>
          </ol>
        </nav>

        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h1 className="mb-4 text-3xl leading-[1.15] font-semibold text-gray-900 md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>
          <div className="text-sm text-gray-500">
            last updated: {new Date(blog.created_at).toLocaleDateString()}
          </div>
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="text-sm text-gray-500">Share this blog:</span>
            <FacebookShareButton
              url={shareUrl}
              quote={blog.title}
              hashtag={"#nepdora"}
            >
              <FacebookIcon size={27} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={shareUrl}
              title={blog.title}
              hashtags={["nepdora"]}
            >
              <TwitterIcon size={27} round />
            </TwitterShareButton>
            <LinkedinShareButton
              url={shareUrl}
              title={blog.title}
              summary={blog.title}
            >
              <LinkedinIcon size={27} round />
            </LinkedinShareButton>
            <WhatsappShareButton url={shareUrl} title={blog.title}>
              <WhatsappIcon size={27} round />
            </WhatsappShareButton>
            <RedditShareButton url={shareUrl} title={blog.title}>
              <RedditIcon size={27} round />
            </RedditShareButton>
            <TelegramShareButton url={shareUrl} title={blog.title}>
              <TelegramIcon size={27} round />
            </TelegramShareButton>
          </div>
        </div>

        {blog.thumbnail_image && (
          <div className="mx-auto mb-10 h-[300px] max-w-6xl overflow-hidden rounded-xl md:h-[450px]">
            <Image
              src={blog.thumbnail_image}
              alt={blog.thumbnail_image_alt_description ?? blog.title}
              width={1200}
              height={600}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-xl prose-gray mx-auto mb-80 max-w-4xl space-y-8 leading-8">
          <div
            dangerouslySetInnerHTML={{ __html: sanitizeContent(blog.content) }}
          />
        </div>
      </div>
    </div>
  );
};

export const BlogDetailViewWrapper = () => {
  const params = useParams();
  const slug =
    (Array.isArray(params.slug) ? params.slug[0] : params.slug) || "";

  const { data: blog, isLoading, error } = useMarketingBlog(slug);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!blog) return <div>Blog not found</div>;

  return <BlogDetailView blog={blog} />;
};
