export interface ExperienceTemplate1Data {
  template: "experience-1";
  title: string;
  backgroundType: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  collectionId?: number;
  collectionSlug?: string;
}

export interface ExperienceTemplate2Data {
  template: "experience-2";
  title: string;
  sub_title: string;
  collectionId?: number;
  collectionSlug?: string;
}

export type ExperienceData = ExperienceTemplate1Data | ExperienceTemplate2Data;

export const DEFAULT_EXPERIENCE_MAP: Record<
  ExperienceData["template"],
  ExperienceData
> = {
  "experience-1": {
    template: "experience-1",
    title: "Experience",
    backgroundType: "color",
    backgroundColor: "#FFFFFF",
    collectionSlug: "experience",
  },
  "experience-2": {
    template: "experience-2",
    title: "Experience",
    sub_title: "Where I've worked",
    collectionSlug: "experience",
  },
};

export const isExperienceTemplate1 = (
  data: ExperienceData
): data is ExperienceTemplate1Data => data.template === "experience-1";

export const isExperienceTemplate2 = (
  data: ExperienceData
): data is ExperienceTemplate2Data => data.template === "experience-2";
