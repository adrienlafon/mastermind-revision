/**
 * types.ts — Définitions TypeScript centrales de l'application.
 *
 * Contient :
 * - Les types de catégories (defense, guard, passing, submission)
 * - Les niveaux de ceinture (white → black)
 * - Les niveaux de maîtrise d'une technique (not_learned → competition_ok)
 * - Les interfaces Technique, UserTechnique, TechniqueSystem
 * - Les configs couleurs/icônes pour l'affichage
 * - Les types pour l'arbre de décision (DecisionTree, DecisionTreeNode)
 */

// Catégories de techniques — chaque technique appartient à une catégorie
export type Category = 'defense' | 'guard' | 'passing' | 'submission';

// Niveaux de ceinture JJB, de blanche à noire
export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

// Niveaux de maîtrise d'une technique par l'élève
// not_learned : pas encore travaillé
// in_progress : en cours d'apprentissage
// sparring_ok : validé en sparring
// competition_ok : prêt pour la compétition
export type MasteryLevel = 'not_learned' | 'in_progress' | 'sparring_ok' | 'competition_ok';

// Technique de la bibliothèque (données de base, pas de progression utilisateur)
export interface Technique {
  id: number;
  name: string;
  category: Category;
  description: string;
  videoUrl?: string;  // Lien vers la vidéo Patreon
}

// Système = groupe de techniques créé par l'élève (ex: "Mon jeu de garde")
export type SystemCategory = 'guard' | 'passing' | 'submission';

export interface TechniqueSystem {
  id: number;
  name: string;
  category: SystemCategory;
  techniqueIds: number[];
  validated: boolean;
}

// Progression personnelle d'un utilisateur sur une technique
export interface UserTechnique {
  odtechniqueId: number;
  masteryLevel: MasteryLevel;    // Niveau de maîtrise actuel
  notes: string;                 // Notes personnelles de l'élève
  inGamePlan: boolean;           // Inclus dans le game plan ?
  orderIndex: number;            // Position dans le game plan
}

// Vue combinée : technique de base + progression de l'utilisateur
// Utilisé pour l'affichage dans toute l'app
export interface TechniqueWithProgress extends Technique {
  masteryLevel: MasteryLevel;
  notes: string;
  inGamePlan: boolean;
  orderIndex: number;
}

// Configuration visuelle d'une catégorie (label, couleur, emoji)
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

export const BELT_CONFIG: Record<Belt, { label: string; color: string; icon: string }> = {
  white: { label: 'Blanche', color: '#e5e7eb', icon: '🤍' },
  blue: { label: 'Bleue', color: '#3b82f6', icon: '💙' },
  purple: { label: 'Violet', color: '#a855f7', icon: '💜' },
  brown: { label: 'Marron', color: '#92400e', icon: '🤎' },
  black: { label: 'Noire', color: '#1f2937', icon: '🖤' },
};

export const SYSTEM_CATEGORY_CONFIG: Record<SystemCategory, CategoryConfig> = {
  guard: CATEGORY_CONFIG.guard,
  passing: CATEGORY_CONFIG.passing,
  submission: CATEGORY_CONFIG.submission,
};

// Filtre de navigation depuis les objectifs du dashboard
// Permet de pré-filtrer l'écran Progression quand on clique sur un objectif
export type ProgressionFilter = 
  | { tab: 'techniques'; category: Category }
  | { tab: 'systems' }
  | null;

// ─── Arbre de décision (Game Plan Tree) ──────────────────────
// Permet de modéliser un arbre de décision avec des branches
// conditionnelles : "Si l'adversaire fait X, alors je fais Y"

export interface DecisionTreeNode {
  id: string;
  label: string;                    // Position ou technique (ex: "Garde fermée")
  description?: string;             // Détails / instruction
  techniqueId?: number;             // Lien optionnel vers une technique de la bibliothèque
  children: DecisionTreeBranch[];   // Branches = réactions possibles de l'adversaire
}

// Branche d'un arbre de décision : condition → nœud suivant
export interface DecisionTreeBranch {
  condition: string;                // Condition / réaction adverse (ex: "il recule ses hanches")
  nodeId: string;                   // ID du nœud cible
}

// Un arbre de décision complet avec tous ses nœuds
export interface DecisionTree {
  id: string;
  name: string;
  rootNodeId: string;
  nodes: Record<string, DecisionTreeNode>;
  createdAt: string;
  updatedAt: string;
}
