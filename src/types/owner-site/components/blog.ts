export interface BlogData {
  component_id?: string;
  component_type: "blog";
  style: "blog-1" | "blog-2" | "blog-3" | "blog-4" | "blog-5";
  title: string;
  subtitle?: string;
  page_size: number;
  showPagination?: boolean;
  itemsPerRow?: number;
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showReadTime?: boolean;
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
  component_type: "blog",
  style: "blog-1",
  title: "Latest Blog Posts",
  subtitle: "Stay updated with our newest articles and insights.",
  page_size: 6,
  showPagination: false,
  itemsPerRow: 3,
  showAuthor: true,
  showDate: true,
  showTags: true,
  showReadTime: true,
};
