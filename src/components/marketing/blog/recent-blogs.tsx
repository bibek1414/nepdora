import React from "react";
import { marketingBlogApi } from "@/services/api/marketing/blog";
import { RecentBlogsList } from "./recent-blogs-list";

const RecentBlogs = async () => {
  try {
    const blogs = await marketingBlogApi.getRecentBlogs();

    if (!blogs || blogs.length === 0) {
      return null;
    }

    return <RecentBlogsList blogs={blogs} />;
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return null;
  }
};

export default RecentBlogs;
