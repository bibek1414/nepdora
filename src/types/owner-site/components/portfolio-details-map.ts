import { ComponentTypeMap } from "./components";

export const DEFAULT_PORTFOLIO_DETAILS_MAP: Record<
  string,
  ComponentTypeMap["portfolio_details"]
> = {
  "portfolio-details-style-1": {
    style: "style-1",
    showRelatedPortfolio: true,
  },
  "portfolio-details-style-2": {
    style: "style-2",
    showRelatedPortfolio: true,
  },
  "portfolio-details-style-3": {
    style: "style-3",
    showRelatedPortfolio: true,
  },
};
