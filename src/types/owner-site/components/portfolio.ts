export interface PortfolioData {
  component_id?: string;
  component_type: "portfolio";
  style: "portfolio-1" | "portfolio-2" | "portfolio-3";
  title: string;
  subtitle?: string;
  itemsToShow: number;
  showPagination?: boolean;
  columns?: 2 | 3 | 4;
  showCategories?: boolean;
  showTechnologies?: boolean;
  showFilters?: boolean;
  order?: number;
}

export interface PortfolioComponentData {
  id: string | number;
  component_id: string;
  component_type: "portfolio";
  data: PortfolioData;
  order?: number;
  page?: string;
}

export const defaultPortfolioData: PortfolioData = {
  component_type: "portfolio",
  style: "portfolio-1",
  title: "Our Portfolio",
  subtitle: "Explore our latest work and creative projects",
  itemsToShow: 6,
  showPagination: false,
  columns: 3,
  showCategories: true,
  showTechnologies: true,
  showFilters: true,
};
