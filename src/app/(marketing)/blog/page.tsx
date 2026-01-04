import React from "react";
import Blogs from "@/components/marketing/blog/blogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Nepdora — Latest Insights and Updates",
  description:
    "Explore the latest insights, tutorials, and updates from Nepdora. Learn how to build and grow your online presence with our website builder and e-commerce tools.",
};

const BlogPage = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Latest Stories
              </h2>
            </div>
          </div>

          <Blogs />
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
