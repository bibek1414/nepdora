import { Suspense } from "react";
import Blogs, { BlogCardSkeleton } from "@/components/marketing/blog/blogs";
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
            <Blogs />
          </Suspense>
        </div>
      </section>
      <ContactUs />
    </div>
  );
};

export default BlogPage;
