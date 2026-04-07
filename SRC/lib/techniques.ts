import { Technique, Category } from './types';
import { INITIAL_KNOWLEDGE_POINTS } from './data';

const THEME_TO_CATEGORY: Record<string, Category> = {
  defense: 'defense',
  garde: 'guard',
  passage: 'passing',
  attaque: 'submission',
};

export const TECHNIQUES: Technique[] = INITIAL_KNOWLEDGE_POINTS.map(kp => ({
  id: kp.id,
  name: kp.title,
  category: kp.theme ? (THEME_TO_CATEGORY[kp.theme] ?? 'defense') : 'passing',
  description: kp.description,
  videoUrl: kp.videoLink,
}));
