/**
 * techniques.ts — Convertit les données brutes de data.ts en objets Technique.
 *
 * Fait le pont entre le format KnowledgePoint (historique, utilisé dans data.ts)
 * et le format Technique (utilisé dans le store et l'affichage).
 * Mappe aussi les thèmes français (defense, garde, passage, attaque)
 * vers les catégories internes (defense, guard, passing, submission).
 */
import { Technique, Category } from './types';
import { INITIAL_KNOWLEDGE_POINTS } from './data';

// Mapping thème français → catégorie interne
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
