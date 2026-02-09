export interface BlogData {
  component_id?: string;
  style:
    | "blog-1"
    | "blog-2"
    | "blog-3"
    | "blog-4"
    | "blog-5"
    | "blog-6"
    | "blog-7";
  title: string;
  subtitle?: string;
  order?: number;
}

export interface BlogComponentData {
  id: string | number;
  component_id: string;
  component_type: "blog";
  data: BlogData;
  order?: number;
  page?: string;
}

export const defaultBlogData: BlogData = {
  style: "blog-1",
  title: "Latest Blog Posts",
  subtitle: "Stay updated with our newest articles and insights.",
};

export const DEFAULT_BLOG_MAP: Record<BlogData["style"], BlogData> = {
  "blog-1": { ...defaultBlogData, style: "blog-1" },
  "blog-2": { ...defaultBlogData, style: "blog-2" },
  "blog-3": { ...defaultBlogData, style: "blog-3" },
  "blog-4": { ...defaultBlogData, style: "blog-4" },
  "blog-5": { ...defaultBlogData, style: "blog-5" },
  "blog-6": { ...defaultBlogData, style: "blog-6" },
  "blog-7": { ...defaultBlogData, style: "blog-7" },
};
