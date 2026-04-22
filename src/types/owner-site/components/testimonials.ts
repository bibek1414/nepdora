export interface TestimonialsData {
  component_id?: string;
  component_type: "testimonials";
  style:
    | "testimonial-1"
    | "testimonial-2"
    | "testimonial-3"
    | "testimonial-4"
    | "testimonial-5"
    | "testimonial-6"
    | "testimonial-7"
    | "testimonial-8"
    | "testimonial-9"
    | "testimonial-10";
  title: string;
  subtitle?: string;
  page_size: number;
  order?: number;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface TestimonialsComponentData {
  id: string | number;
  component_id: string;
  component_type: "testimonials";
  data: TestimonialsData;
  order?: number;
  page?: string;
}

export const defaultTestimonialsData: TestimonialsData = {
  component_type: "testimonials",
  style: "testimonial-1",
  title: "What Our Clients Say",
  subtitle:
    "Don't just take our word for it - hear from our satisfied customers",
  page_size: 6,
  backgroundImage:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1600&q=80",
};

export const DEFAULT_TESTIMONIALS_MAP: Record<
  TestimonialsData["style"],
  TestimonialsData
> = {
  "testimonial-1": { ...defaultTestimonialsData, style: "testimonial-1" },
  "testimonial-2": { ...defaultTestimonialsData, style: "testimonial-2" },
  "testimonial-3": { ...defaultTestimonialsData, style: "testimonial-3" },
  "testimonial-4": { ...defaultTestimonialsData, style: "testimonial-4" },
  "testimonial-5": { ...defaultTestimonialsData, style: "testimonial-5" },
  "testimonial-6": { ...defaultTestimonialsData, style: "testimonial-6" },
  "testimonial-7": { ...defaultTestimonialsData, style: "testimonial-7" },
  "testimonial-8": {
    ...defaultTestimonialsData,
    style: "testimonial-8",
    title: "A global reputation for client satisfaction",
    subtitle:
      "They understood our vision perfectly and delivered a design beyond our expectations - efficient, elegant, and inspiring.",
    buttonText: "Get in touch",
    buttonLink: "#",
  },
  "testimonial-9": {
    ...defaultTestimonialsData,
    style: "testimonial-9",
    title: "Kind words",
    subtitle: "From the people I've worked with.",
  },
  "testimonial-10": {
    ...defaultTestimonialsData,
    style: "testimonial-10",
    title: "Quietly proud of the company we keep.",
    subtitle: "In their words",
  },
};
