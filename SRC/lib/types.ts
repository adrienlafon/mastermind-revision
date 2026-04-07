// Category types
export type Category = 'defense' | 'guard' | 'passing' | 'submission';

// Mastery levels
export type MasteryLevel = 'not_learned' | 'in_progress' | 'sparring_ok' | 'competition_ok';

// Technique from library
export interface Technique {
  id: number;
  name: string;
  category: Category;
  description: string;
  videoUrl?: string;
}

// User's progress on a technique
export interface UserTechnique {
  odtechniqueId: number;
  masteryLevel: MasteryLevel;
  notes: string;
  inGamePlan: boolean;
  orderIndex: number;
}

// Combined view for displaying
export interface TechniqueWithProgress extends Technique {
  masteryLevel: MasteryLevel;
  notes: string;
  inGamePlan: boolean;
  orderIndex: number;
}

// Category config with colors and icons
export interface CategoryConfig {
  label: string;
  color: string;
  icon: string;
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  defense: { label: 'Défense', color: '#a855f7', icon: '🛡️' },
  guard: { label: 'Garde', color: '#eab308', icon: '🏰' },
  passing: { label: 'Passage', color: '#22c55e', icon: '🔄' },
  submission: { label: 'Soumission', color: '#ef4444', icon: '⚔️' },
};

export const MASTERY_CONFIG: Record<MasteryLevel, { label: string; color: string; shortLabel: string }> = {
  not_learned: { label: 'Non appris', shortLabel: '❌', color: '#6b7280' },
  in_progress: { label: 'En cours', shortLabel: '🔄', color: '#f59e0b' },
  sparring_ok: { label: 'OK sparring', shortLabel: '✅', color: '#3b82f6' },
  competition_ok: { label: 'OK compétition', shortLabel: '🏆', color: '#22c55e' },
};
