export interface CollectionsData {
  component_id?: string;
  style: "collections-style-1" | "collections-style-2" | "collections-style-3";
  title: string;
  subtitle?: string;
  collectionId?: number;
  collectionSlug?: string;
  itemsToShow?: number;
}

export const defaultCollectionsData: CollectionsData = {
  style: "collections-style-1",
  title: "Our Collection",
  subtitle: "Check out our latest entries",
  itemsToShow: 6,
};

export const DEFAULT_COLLECTIONS_MAP: Record<
  CollectionsData["style"],
  CollectionsData
> = {
  "collections-style-1": {
    ...defaultCollectionsData,
    style: "collections-style-1",
  },
  "collections-style-2": {
    ...defaultCollectionsData,
    style: "collections-style-2",
  },
  "collections-style-3": {
    ...defaultCollectionsData,
    style: "collections-style-3",
  },
};
