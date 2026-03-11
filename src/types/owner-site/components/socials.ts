export interface SocialsStyle1Data {
  template: "socials-style-1";
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundType?: "color" | "gradient" | "image";
  backgroundColor?: string;
  backgroundImageUrl?: string;
}

export type SocialsData = SocialsStyle1Data;

export interface SocialsComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "socials";
  data: SocialsData;
  type?: "socials";
  order: number;
  page?: number;
}

export const DEFAULT_SOCIALS_MAP: Record<SocialsData["template"], SocialsData> =
  {
    "socials-style-1": {
      template: "socials-style-1",
      title: "Get In Touch",
      subtitle: "Let's build something together",
      description:
        "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
      backgroundType: "color",
      backgroundColor: "#FFFFFF",
    },
  };
