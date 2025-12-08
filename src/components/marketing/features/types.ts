export interface LogEntry {
  id: number;
  text: string;
  type: "info" | "success";
}

export interface Order {
  id: number;
  route: "express" | "standard";
}

export interface OrderParticleProps {
  route: "express" | "standard";
  onLog: (text: string, type?: "info" | "success") => void;
  onComplete: () => void;
}

export interface SearchScenario {
  query: string;
  result: {
    site: string;
    url: string;
    title: string;
    desc: string;
  };
}

export interface FeatureBlockProps {
  title: string;
  description: string;
  Visual: React.FC;
  reversed?: boolean;
}
