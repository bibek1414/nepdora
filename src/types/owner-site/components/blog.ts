export interface BlogDisplayData {
  component_id?: string;
  component_type: "blog";
  style: "grid-1" | "grid-2" | "list-1" | "carousel-1";
  title: string;
  subtitle?: string;
  limit: number;
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
  data: BlogDisplayData;
  order?: number;
  page?: string;
}

export const defaultBlogDisplayData: BlogDisplayData = {
  component_type: "blog",
  style: "grid-1",
  title: "Latest Blog Posts",
  subtitle: "Stay updated with our newest articles and insights.",
  limit: 6,
  showPagination: false,
  itemsPerRow: 3,
  showAuthor: true,
  showDate: true,
  showTags: true,
  showReadTime: true,
};
