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
    | "testimonial-7";

  title: string;
  subtitle?: string;
  page_size: number;
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
  style: "testimonial-1",
  title: "What Our Clients Say",
  subtitle:
    "Don't just take our word for it - hear from our satisfied customers",
  page_size: 6,
};
