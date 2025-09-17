export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  image: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
}

export type TestimonialResponse = Testimonial[];

export interface CreateTestimonialData {
  name: string;
  comment: string;
  designation?: string;
  image?: File | null;
}

export interface UpdateTestimonialData {
  name?: string;
  comment?: string;
  designation?: string;
  image?: File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: Testimonial | null;
  onSubmit: (data: CreateTestimonialData) => void;
  isLoading: boolean;
}

export interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSubmit: (data: CreateTestimonialData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export interface TestimonialsTableProps {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export interface TestimonialsHeaderProps {
  onAdd: () => void;
  testimonialsCount: number;
}
