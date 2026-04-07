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
    | "team-7"
    | "team-8";

  title: string;
  subtitle?: string;
  tag?: string;
  page_size: number;
  order?: number;

  // For style 8 (embedded members)
  title_description?: string;
  members?: TeamStyle8Member[];
}

export interface TeamStyle8Member {
  id: string;
  name: string;
  role: string;
  image: string;
  about: string;
  experience: string;
  highlights: string[];
}

export interface TeamStyle8Data extends TeamData {
  style: "team-8";
  members: TeamStyle8Member[];
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

export const DEFAULT_TEAM_MAP: Record<TeamData["style"], TeamData> = {
  "team-1": { ...defaultTeamData, style: "team-1" },
  "team-2": { ...defaultTeamData, style: "team-2" },
  "team-3": { ...defaultTeamData, style: "team-3" },
  "team-4": { ...defaultTeamData, style: "team-4" },
  "team-5": { ...defaultTeamData, style: "team-5" },
  "team-6": {
    ...defaultTeamData,
    style: "team-6",
    title: "Meet Our Travel Experts",
    tag: "Our Team",
    subtitle:
      "Get to know the passionate individuals behind our travel company, dedicated to crafting unforgettable experiences.",
  },
  "team-7": {
    ...defaultTeamData,
    style: "team-7",
    title: "Dedicated volunteers driving our mission for change",
    subtitle: "Our Team",
  },
  "team-8": {
    ...defaultTeamData,
    style: "team-8",
    title: "Our creative minds",
    subtitle: "Our Team",
    title_description:
      "Lorem ipsum dolor sit amet consectetur faucibus nunc habitasse aliquam vestibulum auctor fringilla risus consequat est semper.",
    members: [
      {
        id: "1",
        name: "John Carter",
        role: "CEO & Founder",
        image: "https://picsum.photos/seed/john/600/800",
        about:
          "Lorem ipsum dolor sit amet consectetur est mauris turpis aliquet at maecenas viverra arcu cursus dictum tellus sed tellus quam congue pulvinar sed semper vel habitasse fringilla massa dui integer est elit quis at lectus at volutpat pharetra quam tellus sit.",
        experience:
          "Experience with established design systems, modern visual trends, and responsive web aesthetics.",
        highlights: [
          "10+ years of creative leadership",
          "Award-winning digital experiences",
          "Expert in user-centric design",
        ],
      },
      {
        id: "2",
        name: "Sophie Moore",
        role: "Creative Director",
        image: "https://picsum.photos/seed/sophie/600/800",
        about:
          "Passion for mixing traditional editorial layout principles with cutting-edge interaction design.",
        experience:
          "Led design teams for Fortune 500 companies and high-growth tech startups.",
        highlights: [
          "Expertise in brand identity",
          "Focus on accessibility and inclusion",
          "Collaborative team-builder",
        ],
      },
      {
        id: "3",
        name: "Matt Cannon",
        role: "Product Designer",
        image: "https://picsum.photos/seed/matt/600/800",
        about:
          "Skilled at breaking down complex user problems into elegant, minimalist digital solutions.",
        experience:
          "Background in industrial design and human-computer interaction.",
        highlights: [
          "Rapid prototyping specialist",
          "Data-driven design approach",
          "Continuous learner and mentor",
        ],
      },
      {
        id: "4",
        name: "Lily Woods",
        role: "Marketing Manager",
        image: "https://picsum.photos/seed/lily/600/800",
        about:
          "Bridging the gap between brand storytelling and performance marketing to drive growth.",
        experience:
          "Years of experience in content strategy, social media, and digital campaigns.",
        highlights: [
          "Strategic campaign management",
          "Effective communicator and storyteller",
          "Customer-focused mindset",
        ],
      },
    ],
  },
};
