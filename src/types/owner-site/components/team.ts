export interface TeamData {
  component_id?: string;
  component_type: "team";
  style:
    | "team-1"
    | "team-2"
    | "team-3"
    | "team-4"
    | "team-5"
    | "team-6"
    | "team-7";

  title: string;
  subtitle?: string;
  page_size: number;
  order?: number;
}

export interface TeamComponentData {
  id: string | number;
  component_id: string;
  component_type: "team";
  data: TeamData;
  order?: number;
  page?: string;
}

export const defaultTeamData: TeamData = {
  component_type: "team",
  style: "team-1",
  title: "Meet Our Team",
  subtitle: "Get to know the talented individuals who make it all happen",
  page_size: 8,
};
