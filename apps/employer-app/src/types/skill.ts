import { SkillCategory } from './skillCategory';

export interface Skill {
  id: number;
  name: string;
  category: SkillCategory;
}
