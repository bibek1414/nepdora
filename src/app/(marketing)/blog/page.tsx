import React, { Suspense } from "react";
import Blogs, { BlogCardSkeleton } from "@/components/marketing/blog/blogs";
import { Sidebar } from "@/components/marketing/blog/sidebar";
import { Metadata } from "next";
import ContactUs from "@/components/marketing/contact-us/contact-us";

export const metadata: Metadata = {
  title: "Blog | Nepdora — Latest Insights and Updates",
  description:
    "Explore the latest insights, tutorials, and updates from Nepdora. Learn how to build and grow your online presence with our website builder and e-commerce tools.",
};

const BlogPage = () => {
  return (
    <div className="">
      <section className="mb-20 py-20">
        <div className="mx-auto max-w-7xl px-10 md:px-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 xl:gap-20">
            {/* Main Feed */}
            <div className="lg:col-span-8">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {[1, 2, 3, 4].map(n => (
                      <BlogCardSkeleton key={n} />
                    ))}
                  </div>
                }
              >
                <Blogs />
              </Suspense>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-2xl bg-gray-100" />
                }
              >
                <Sidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <ContactUs />
    </div>
  );
};

export default BlogPage;
