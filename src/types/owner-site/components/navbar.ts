export interface NavbarLink {
  id: string;
  text: string;
  href: string;
}

export interface NavbarButton {
  id: string;
  text: string;
  variant: "primary" | "secondary" | "outline";
  href: string;
}

export interface NavbarData {
  logoText: string;
  links: NavbarLink[];
  buttons: NavbarButton[];
  style: string;
}

export interface Navbar {
  id: string;
  type: "navbar";
  content: string;
  data: NavbarData;
}

export interface GetNavbarResponse {
  data: Navbar | null;
  message: string;
}

export interface CreateNavbarRequest {
  content: string;
  navbarData: NavbarData;
  component_id: string;
}

export interface CreateNavbarResponse {
  data: Navbar;
  message: string;
}

export interface UpdateNavbarRequest {
  id: string;
  content?: string;
  navbarData?: Partial<NavbarData>;
}

export interface UpdateNavbarResponse {
  data: Navbar;
  message: string;
}

export interface DeleteNavbarResponse {
  message: string;
}
