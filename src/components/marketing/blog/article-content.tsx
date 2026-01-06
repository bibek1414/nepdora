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
      <div className="prose prose-lg prose-indigo prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 prose-img:rounded-[40px] prose-img:shadow-2xl prose-a:text-indigo-600 max-w-none leading-relaxed font-normal text-gray-700">
        <p className="mb-10 text-lg leading-[1.4] font-medium tracking-tight text-gray-900">
          {post.title}
        </p>
        <Image
          src={post.thumbnail_image || "/images/placeholder.svg"}
          alt={post.title}
          width={1000}
          height={600}
          className="mb-6 rounded-[10px]"
        />
        <div
          className="[&>p:first-of-type]:first-letter:text-primary [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:mr-3 [&>p:first-of-type]:first-letter:text-7xl [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:font-bold"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtmlContent(post.content),
          }}
        />
      </div>

      <div className="mt-8 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Share this article
        </h3>
        <SocialShare url={shareUrl} title={post.title} />
      </div>
    </div>
  );
};

export default ArticleContent;
