import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Technique, UserTechnique, MasteryLevel, TechniqueWithProgress, Category, Belt, TechniqueSystem, SystemCategory } from './types';
import { TECHNIQUES } from './techniques';

export interface BeltObjectiveStatus {
  label: string;
  description: string;
  completed: boolean;
}

export interface AppState {
  // User settings
  belt: Belt;
  // User technique progress
  userTechniques: Record<number, UserTechnique>;
  // Custom techniques added by the user
  customTechniques: Technique[];
  // Technique systems
  systems: TechniqueSystem[];
  
  // Actions
  setBelt: (belt: Belt) => void;
  updateMastery: (techniqueId: number, level: MasteryLevel) => void;
  updateNotes: (techniqueId: number, notes: string) => void;
  toggleGamePlan: (techniqueId: number) => void;
  reorderGamePlan: (fromIndex: number, toIndex: number) => void;
  addCustomTechnique: (technique: Omit<Technique, 'id'>) => number;
  createSystem: (name: string, category: SystemCategory) => number;
  deleteSystem: (systemId: number) => void;
  addTechniqueToSystem: (systemId: number, techniqueId: number) => void;
  removeTechniqueFromSystem: (systemId: number, techniqueId: number) => void;
  validateSystem: (systemId: number) => void;
  
  // Computed selectors
  getAllTechniques: () => Technique[];
  getTechniqueWithProgress: (techniqueId: number) => TechniqueWithProgress | undefined;
  getAllTechniquesWithProgress: () => TechniqueWithProgress[];
  getProgressionTechniques: () => TechniqueWithProgress[];
  getGamePlanTechniques: () => TechniqueWithProgress[];
  getProgressByCategory: () => Record<Category, { total: number; learned: number; percentage: number }>;
  getBeltObjectives: () => BeltObjectiveStatus[];
}

const getInitialUserTechnique = (techniqueId: number): UserTechnique => ({
  odtechniqueId: techniqueId,
  masteryLevel: 'not_learned',
  notes: '',
  inGamePlan: false,
  orderIndex: 0,
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      belt: 'white' as Belt,
      userTechniques: {},
      customTechniques: [],
      systems: [],

      setBelt: (belt) => set({ belt }),

      updateMastery: (techniqueId, level) => {
        set((state) => ({
          userTechniques: {
            ...state.userTechniques,
            [techniqueId]: {
              ...(state.userTechniques[techniqueId] || getInitialUserTechnique(techniqueId)),
              masteryLevel: level,
            },
          },
        }));
      },

      updateNotes: (techniqueId, notes) => {
        set((state) => ({
          userTechniques: {
            ...state.userTechniques,
            [techniqueId]: {
              ...(state.userTechniques[techniqueId] || getInitialUserTechnique(techniqueId)),
              notes,
            },
          },
        }));
      },

      toggleGamePlan: (techniqueId) => {
        const state = get();
        const current = state.userTechniques[techniqueId] || getInitialUserTechnique(techniqueId);
        const gamePlanTechniques = Object.values(state.userTechniques).filter(t => t.inGamePlan);
        
        set({
          userTechniques: {
            ...state.userTechniques,
            [techniqueId]: {
              ...current,
              inGamePlan: !current.inGamePlan,
              orderIndex: current.inGamePlan ? 0 : gamePlanTechniques.length,
            },
          },
        });
      },

      reorderGamePlan: (fromIndex, toIndex) => {
        const state = get();
        const gamePlanItems = Object.entries(state.userTechniques)
          .filter(([_, ut]) => ut.inGamePlan)
          .sort((a, b) => a[1].orderIndex - b[1].orderIndex);

        if (fromIndex < 0 || toIndex < 0 || fromIndex >= gamePlanItems.length || toIndex >= gamePlanItems.length) {
          return;
        }

        const [movedItem] = gamePlanItems.splice(fromIndex, 1);
        gamePlanItems.splice(toIndex, 0, movedItem);

        const updatedTechniques = { ...state.userTechniques };
        gamePlanItems.forEach(([id, ut], index) => {
          updatedTechniques[parseInt(id)] = { ...ut, orderIndex: index };
        });

        set({ userTechniques: updatedTechniques });
      },

      addCustomTechnique: (technique) => {
        const state = get();
        const allTechniques = [...TECHNIQUES, ...state.customTechniques];
        const maxId = allTechniques.reduce((max, t) => Math.max(max, t.id), 0);
        const newId = maxId + 1;
        set({ customTechniques: [...state.customTechniques, { ...technique, id: newId }] });
        return newId;
      },

      createSystem: (name, category) => {
        const state = get();
        const maxId = state.systems.reduce((max, s) => Math.max(max, s.id), 0);
        const newId = maxId + 1;
        set({ systems: [...state.systems, { id: newId, name, category, techniqueIds: [], validated: false }] });
        return newId;
      },

      deleteSystem: (systemId) => {
        set((state) => ({ systems: state.systems.filter(s => s.id !== systemId) }));
      },

      addTechniqueToSystem: (systemId, techniqueId) => {
        set((state) => ({
          systems: state.systems.map(s =>
            s.id === systemId && !s.techniqueIds.includes(techniqueId)
              ? { ...s, techniqueIds: [...s.techniqueIds, techniqueId], validated: false }
              : s
          ),
        }));
      },

      removeTechniqueFromSystem: (systemId, techniqueId) => {
        set((state) => ({
          systems: state.systems.map(s =>
            s.id === systemId
              ? { ...s, techniqueIds: s.techniqueIds.filter(id => id !== techniqueId), validated: false }
              : s
          ),
        }));
      },

      validateSystem: (systemId) => {
        set((state) => ({
          systems: state.systems.map(s =>
            s.id === systemId ? { ...s, validated: true } : s
          ),
        }));
      },

      getAllTechniques: () => {
        return [...TECHNIQUES, ...get().customTechniques];
      },

      getTechniqueWithProgress: (techniqueId) => {
        const allTechniques = [...TECHNIQUES, ...get().customTechniques];
        const technique = allTechniques.find(t => t.id === techniqueId);
        if (!technique) return undefined;

        const userTechnique = get().userTechniques[techniqueId] || getInitialUserTechnique(techniqueId);
        
        return {
          ...technique,
          masteryLevel: userTechnique.masteryLevel,
          notes: userTechnique.notes,
          inGamePlan: userTechnique.inGamePlan,
          orderIndex: userTechnique.orderIndex,
        };
      },

      getAllTechniquesWithProgress: () => {
        const state = get();
        const allTechniques = [...TECHNIQUES, ...state.customTechniques];
        return allTechniques.map(technique => {
          const userTechnique = state.userTechniques[technique.id] || getInitialUserTechnique(technique.id);
          return {
            ...technique,
            masteryLevel: userTechnique.masteryLevel,
            notes: userTechnique.notes,
            inGamePlan: userTechnique.inGamePlan,
            orderIndex: userTechnique.orderIndex,
          };
        });
      },

      getProgressionTechniques: () => {
        return get().getAllTechniquesWithProgress().filter(
          t => t.masteryLevel !== 'not_learned'
        );
      },

      getGamePlanTechniques: () => {
        return get().getAllTechniquesWithProgress()
          .filter(t => t.inGamePlan)
          .sort((a, b) => a.orderIndex - b.orderIndex);
      },

      getProgressByCategory: () => {
        const techniques = get().getAllTechniquesWithProgress();
        const categories: Category[] = ['defense', 'guard', 'passing', 'submission'];
        
        return categories.reduce((acc, category) => {
          const categoryTechniques = techniques.filter(t => t.category === category);
          const learned = categoryTechniques.filter(
            t => t.masteryLevel === 'sparring_ok' || t.masteryLevel === 'competition_ok'
          ).length;
          
          acc[category] = {
            total: categoryTechniques.length,
            learned,
            percentage: categoryTechniques.length > 0 
              ? Math.round((learned / categoryTechniques.length) * 100) 
              : 0,
          };
          return acc;
        }, {} as Record<Category, { total: number; learned: number; percentage: number }>);
      },

      getBeltObjectives: () => {
        const state = get();
        const belt = state.belt;
        const allTechniques = get().getAllTechniquesWithProgress();
        const defenseTechniques = allTechniques.filter(t => t.category === 'defense');
        const defenseMastered = defenseTechniques.filter(
          t => t.masteryLevel === 'sparring_ok' || t.masteryLevel === 'competition_ok'
        ).length;

        const guardSystems = state.systems.filter(s => s.category === 'guard');
        const passingSystems = state.systems.filter(s => s.category === 'passing');
        const submissionSystems = state.systems.filter(s => s.category === 'submission');

        const validatedGuard = guardSystems.filter(s => s.validated).length;
        const validatedPassing = passingSystems.filter(s => s.validated).length;
        const validatedSubmission = submissionSystems.filter(s => s.validated).length;

        const objectives: BeltObjectiveStatus[] = [];

        if (belt === 'white') {
          objectives.push({
            label: 'Défenses',
            description: `Maîtriser toutes les défenses (${defenseMastered}/${defenseTechniques.length})`,
            completed: defenseTechniques.length > 0 && defenseMastered === defenseTechniques.length,
          });
          objectives.push({
            label: 'Système de garde',
            description: `1 système de garde validé (${validatedGuard}/1)`,
            completed: validatedGuard >= 1,
          });
          objectives.push({
            label: 'Système de passage',
            description: `1 système de passage validé (${validatedPassing}/1)`,
            completed: validatedPassing >= 1,
          });
        } else if (belt === 'blue') {
          objectives.push({
            label: 'Défenses',
            description: `Maîtriser toutes les défenses (${defenseMastered}/${defenseTechniques.length})`,
            completed: defenseTechniques.length > 0 && defenseMastered === defenseTechniques.length,
          });
          objectives.push({
            label: 'Systèmes de garde',
            description: `2 systèmes de garde validés (${validatedGuard}/2)`,
            completed: validatedGuard >= 2,
          });
          objectives.push({
            label: 'Systèmes de passage',
            description: `2 systèmes de passage validés (${validatedPassing}/2)`,
            completed: validatedPassing >= 2,
          });
          objectives.push({
            label: 'Système de soumission',
            description: `1 système de soumission validé (${validatedSubmission}/1)`,
            completed: validatedSubmission >= 1,
          });
        } else if (belt === 'purple') {
          objectives.push({
            label: 'Défenses',
            description: `Maîtriser toutes les défenses (${defenseMastered}/${defenseTechniques.length})`,
            completed: defenseTechniques.length > 0 && defenseMastered === defenseTechniques.length,
          });
          objectives.push({
            label: 'Systèmes de garde',
            description: `3 systèmes de garde validés (${validatedGuard}/3)`,
            completed: validatedGuard >= 3,
          });
          objectives.push({
            label: 'Systèmes de passage',
            description: `3 systèmes de passage validés (${validatedPassing}/3)`,
            completed: validatedPassing >= 3,
          });
          objectives.push({
            label: 'Systèmes de soumission',
            description: `2 systèmes de soumission validés (${validatedSubmission}/2)`,
            completed: validatedSubmission >= 2,
          });
        } else if (belt === 'brown') {
          objectives.push({
            label: 'Défenses',
            description: `Maîtriser toutes les défenses (${defenseMastered}/${defenseTechniques.length})`,
            completed: defenseTechniques.length > 0 && defenseMastered === defenseTechniques.length,
          });
          objectives.push({
            label: 'Systèmes de garde',
            description: `4 systèmes de garde validés (${validatedGuard}/4)`,
            completed: validatedGuard >= 4,
          });
          objectives.push({
            label: 'Systèmes de passage',
            description: `4 systèmes de passage validés (${validatedPassing}/4)`,
            completed: validatedPassing >= 4,
          });
          objectives.push({
            label: 'Systèmes de soumission',
            description: `3 systèmes de soumission validés (${validatedSubmission}/3)`,
            completed: validatedSubmission >= 3,
          });
        } else {
          // black
          objectives.push({
            label: 'Défenses',
            description: `Maîtriser toutes les défenses (${defenseMastered}/${defenseTechniques.length})`,
            completed: defenseTechniques.length > 0 && defenseMastered === defenseTechniques.length,
          });
          objectives.push({
            label: 'Systèmes de garde',
            description: `5 systèmes de garde validés (${validatedGuard}/5)`,
            completed: validatedGuard >= 5,
          });
          objectives.push({
            label: 'Systèmes de passage',
            description: `5 systèmes de passage validés (${validatedPassing}/5)`,
            completed: validatedPassing >= 5,
          });
          objectives.push({
            label: 'Systèmes de soumission',
            description: `4 systèmes de soumission validés (${validatedSubmission}/4)`,
            completed: validatedSubmission >= 4,
          });
        }

        return objectives;
      },
    }),
    {
      name: 'bjj-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
