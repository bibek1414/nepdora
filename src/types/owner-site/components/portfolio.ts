export interface PortfolioData {
  component_id?: string;
  style: "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4";
  title: string;
  subtitle?: string;
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
  style: "portfolio-1",
  title: "Our Portfolio",
  subtitle: "Check out our latest projects",
};

export const DEFAULT_PORTFOLIO_MAP: Record<
  PortfolioData["style"],
  PortfolioData
> = {
  "portfolio-1": { ...defaultPortfolioData, style: "portfolio-1" },
  "portfolio-2": { ...defaultPortfolioData, style: "portfolio-2" },
  "portfolio-3": { ...defaultPortfolioData, style: "portfolio-3" },
  "portfolio-4": { ...defaultPortfolioData, style: "portfolio-4" },
};
