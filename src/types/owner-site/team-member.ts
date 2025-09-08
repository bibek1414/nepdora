export type TEAM = {
  id: number;
  order: number;
  name: string;
  role: string;
  photo: string;
  about?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  department?: Department;
};

interface Department {
  id: number;
  name: string;
}

export type Members = TEAM[];
