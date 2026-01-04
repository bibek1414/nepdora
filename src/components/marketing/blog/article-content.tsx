"use client";

import React from "react";
import { BlogPost } from "@/types/super-admin/blog";
import { sanitizeHtmlContent } from "@/utils/html-sanitizer";
import Image from "next/image";

interface ArticleContentProps {
  post: BlogPost;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ post }) => {
  // We can extract an excerpt if not provided, for the bold intro text
  const excerpt =
    post.meta_description ||
    "Explore the latest insights and updates from Nepdora.";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="prose prose-lg prose-indigo prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-gray-900 prose-img:rounded-[40px] prose-img:shadow-2xl prose-a:text-indigo-600 max-w-none leading-relaxed font-normal text-gray-700">
        <p className="mb-10 text-xl leading-[1.4] font-bold tracking-tight text-gray-900 md:text-2xl">
          {excerpt}
        </p>
        <Image
          src={post.thumbnail_image || "/images/placeholder.svg"}
          alt={post.title}
          width={1000}
          height={600}
          className="mb-6 rounded-[40px] shadow-2xl"
        />
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtmlContent(post.content),
          }}
        />
      </div>
    </div>
  );
};

export default ArticleContent;
