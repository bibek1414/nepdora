export interface CountriesData {
  style: "style-1";
  title: string;
  subtitle: string;
  itemsToShow?: number;
}

export interface CountryDetailsData {
  style: "style-1";
  showRelatedUniversities?: boolean;
}

export const DEFAULT_COUNTRIES_MAP: Record<string, CountriesData> = {
  "countries-style-1": {
    style: "style-1",
    title: "Choose Your Dream Destination",
    subtitle:
      "We partner with top universities across five major study destinations.",
    itemsToShow: 12,
  },
};

export const DEFAULT_COUNTRY_DETAILS_MAP: Record<string, CountryDetailsData> = {
  "country-details-style-1": {
    style: "style-1",
    showRelatedUniversities: true,
  },
};
