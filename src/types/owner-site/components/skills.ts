export interface SkillsData {
  title: string;
  resume_link: string;
  resume_text: string;
  style: string;
}

export interface SkillsComponentData {
  id: string | number;
  component_id: string;
  component_type: "skills";
  data: SkillsData;
  order?: number;
  page?: string;
}

export const DEFAULT_SKILLS_MAP: Record<string, SkillsData> = {
  "skills-style-1": {
    title: "My skills",
    resume_link: "#",
    resume_text: "Browse resume",
    style: "skills-style-1",
  },
};
