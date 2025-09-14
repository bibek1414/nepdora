export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  tags: string[];
  projectUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  featured: boolean;
  completed: boolean;
  completedDate?: string;
}

export interface PortfolioButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href?: string;
}

export interface PortfolioData {
  title: string;
  subtitle: string;
  description: string;
  showFilters: boolean;
  categories: string[];
  items: PortfolioItem[];
  itemsToShow: number;
  showLoadMore: boolean;
  style: "portfolio-1" | "portfolio-2" | "portfolio-3";
  columns: 2 | 3 | 4;
  showDescription: boolean;
  showTechnologies: boolean;
  showCategories: boolean;
  buttons: PortfolioButton[];
  backgroundType: "color" | "gradient";
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface PortfolioComponentData {
  id: string | number;
  component_id?: string;
  component_type?: "portfolio";
  data: PortfolioData;
  type?: "portfolio";
  order: number;
  page?: number;
}

export interface ApiPortfolioComponentResponse {
  id: number;
  component_id: string;
  component_type: "portfolio";
  data: PortfolioData;
  order: number;
  page: number;
}

export interface CreatePortfolioRequest {
  component_id?: string;
  component_type: "portfolio";
  data: PortfolioData;
  order?: number;
}

export interface UpdatePortfolioRequest {
  component_id?: string;
  component_type?: "portfolio";
  data: Partial<PortfolioData>;
  order?: number;
}

export const defaultPortfolioData: PortfolioData = {
  title: "Our Portfolio",
  subtitle: "Featured Projects",
  description:
    "Explore our latest work and creative projects that showcase our expertise and innovation.",
  showFilters: true,
  categories: ["Web Development", "Mobile App", "UI/UX Design", "Branding"],
  items: [
    {
      id: "1",
      title: "E-commerce Platform",
      description:
        "Modern e-commerce solution with advanced features and seamless user experience.",
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      imageAlt: "E-commerce platform screenshot",
      category: "Web Development",
      tags: ["React", "Node.js", "MongoDB"],
      projectUrl: "#",
      demoUrl: "#",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      featured: true,
      completed: true,
      completedDate: "2024-01-15",
    },
    {
      id: "2",
      title: "Mobile Banking App",
      description:
        "Secure and intuitive mobile banking application with real-time transactions.",
      imageUrl:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      imageAlt: "Mobile banking app interface",
      category: "Mobile App",
      tags: ["React Native", "Firebase"],
      projectUrl: "#",
      demoUrl: "#",
      technologies: ["React Native", "Firebase", "Redux"],
      featured: true,
      completed: true,
      completedDate: "2024-02-20",
    },
    {
      id: "3",
      title: "Brand Identity Design",
      description:
        "Complete brand identity package including logo, guidelines, and marketing materials.",
      imageUrl:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
      imageAlt: "Brand identity design showcase",
      category: "Branding",
      tags: ["Logo Design", "Brand Guidelines"],
      projectUrl: "#",
      technologies: ["Adobe Illustrator", "Photoshop"],
      featured: false,
      completed: true,
      completedDate: "2024-03-10",
    },
  ],
  itemsToShow: 6,
  showLoadMore: true,
  style: "portfolio-1",
  columns: 3,
  showDescription: true,
  showTechnologies: true,
  showCategories: true,
  buttons: [
    { id: "1", text: "View All Projects", variant: "primary", href: "#" },
  ],
  backgroundType: "color",
  backgroundColor: "#FFFFFF",
  gradientFrom: "#f8fafc",
  gradientTo: "#e2e8f0",
};

export const defaultPortfolio1Data: PortfolioData = {
  ...defaultPortfolioData,
  style: "portfolio-1",
};

export const defaultPortfolio2Data: PortfolioData = {
  ...defaultPortfolioData,
  style: "portfolio-2",
  columns: 2,
  showFilters: false,
};

export const defaultPortfolio3Data: PortfolioData = {
  ...defaultPortfolioData,
  style: "portfolio-3",
  columns: 4,
  showDescription: false,
};
