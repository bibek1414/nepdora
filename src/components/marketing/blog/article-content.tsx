"use client";

import React from "react";
import { BlogPost } from "@/types/super-admin/blog";
import { sanitizeHtmlContent } from "@/utils/html-sanitizer";
import Image from "next/image";
import SocialShare from "./social-share";

interface ArticleContentProps {
  post: BlogPost;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ post }) => {
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <Image
          src={post.thumbnail_image || "/images/placeholder.svg"}
          alt={post.thumbnail_image_alt_description || post.title}
          width={1000}
          height={600}
          className="mb-8 w-full rounded-[20px] object-cover"
        />
        <div className="mb-4 flex items-center space-x-2 text-sm text-gray-500">
          <span>
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long", // "long" will show full month name
              day: "numeric",
            })}
          </span>

          <span>•</span>
          <span>
            {post.time_to_read}{" "}
            {post.time_to_read?.includes("min") ? "" : "min read"}
          </span>
        </div>
        <h1 className="mb-4 text-xl font-bold text-gray-900">{post.title}</h1>
      </div>

      <div
        dangerouslySetInnerHTML={{
          __html: sanitizeHtmlContent(post.content),
        }}
      />

      <div className="mt-12 border-t pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Share this article
        </h3>
        <SocialShare url={shareUrl} title={post.title} />
      </div>
    </div>
  );
};

export default ArticleContent;
