export interface Skill {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSkill {
  name: string;
  description: string;
}

export interface UpdateSkill extends Partial<CreateSkill> {
  id: number;
}
