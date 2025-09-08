export interface TestimonialsData {
  component_id?: string;
  component_type: "testimonials";
  style: "grid-1" | "grid-2" | "list-1";
  title: string;
  subtitle?: string;
  limit: number;
  order?: number;
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
  style: "grid-1",
  title: "What Our Clients Say",
  subtitle:
    "Don't just take our word for it - hear from our satisfied customers",
  limit: 6,
};
