export interface PortfolioData {
  component_id?: string;
  style:
    | "portfolio-1"
    | "portfolio-2"
    | "portfolio-3"
    | "portfolio-4"
    | "portfolio-5"
    | "portfolio-6"
    | "portfolio-7"
    | "portfolio-8";
  title: string;
  subtitle?: string;
  heading?: string;
  buttonText?: string;
  buttonLink?: string;
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
  heading: "Our Portfolio",
  subtitle: "Check out our latest projects",
};

export const DEFAULT_PORTFOLIO_MAP: Record<
  PortfolioData["style"],
  PortfolioData
> = {
  "portfolio-1": { ...defaultPortfolioData, style: "portfolio-1" },
  "portfolio-2": { ...defaultPortfolioData, style: "portfolio-2" },
  "portfolio-3": { ...defaultPortfolioData, style: "portfolio-3" },
  "portfolio-4": {
    ...defaultPortfolioData,
    style: "portfolio-4",
    buttonText: "Browse all portfolio",
    buttonLink: "#",
  },
  "portfolio-5": { ...defaultPortfolioData, style: "portfolio-5" },
  "portfolio-6": {
    style: "portfolio-6",
    title: "Selected work",
    heading: "A small, focused portfolio.",
    subtitle:
      "Four recent projects I'm proud of. Each one started with a long conversation and ended with something quietly useful.",
    buttonText: "All work",
    buttonLink: "#",
  },
  "portfolio-7": {
    style: "portfolio-7",
    title: "Selected work",
    heading: "Recent engagements we’re proud of.",
    buttonText: "All work",
    buttonLink: "/work",
  },
  "portfolio-8": {
    style: "portfolio-8",
    title: "Our work",
    heading: "Featured Projects",
    subtitle:
      "We help brands and businesses grow through innovation and design.",
    buttonText: "View all work",
    buttonLink: "/portfolio",
  },
};
