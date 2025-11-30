export interface OurClientsData {
  component_id?: string;
  component_type: "our_clients";
  style: "our-clients-1" | "our-clients-2" | "our-clients-3";
  title: string;
  subtitle?: string;
  description?: string;
  client_ids?: number[];
  show_all?: boolean;
  limit?: number;
  order?: number;
}

export interface OurClientsComponentData {
  id: string | number;
  component_id: string;
  component_type: "our_clients";
  data: OurClientsData;
  order?: number;
  page?: string;
}

export const defaultOurClientsData: OurClientsData = {
  component_type: "our_clients",
  style: "our-clients-1",
  title: "Our Clients",
  subtitle: "Companies we worked with",
  description: "We are proud to work with these amazing companies.",
  show_all: true,
  limit: 10,
};

export const defaultOurClientsData2: OurClientsData = {
  component_type: "our_clients",
  style: "our-clients-2",
  title: "Our Partners",
  subtitle: "Collaborating for success",
  description: "Together we achieve more.",
  show_all: true,
  limit: 8,
};

export const defaultOurClientsData3: OurClientsData = {
  component_type: "our_clients",
  style: "our-clients-3",
  title: "As Seen In",
  subtitle: "Featured in top publications",
  description: "",
  show_all: true,
  limit: 6,
};
