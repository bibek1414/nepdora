export interface EducationTemplate1Data {
  template: "education-1";
  title: string;
  collectionId?: number;
  collectionSlug?: string;
}

export type EducationData = EducationTemplate1Data;

export const DEFAULT_EDUCATION_MAP: Record<
  EducationData["template"],
  EducationData
> = {
  "education-1": {
    template: "education-1",
    title: "Education",
    collectionSlug: "education",
  },
};

export const isEducationTemplate1 = (
  data: EducationData
): data is EducationTemplate1Data => data.template === "education-1";
