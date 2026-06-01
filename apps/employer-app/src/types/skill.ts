import { SkillCategory } from './skill-category';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
}
