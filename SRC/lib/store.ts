import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserTechnique, MasteryLevel, TechniqueWithProgress, Category } from './types';
import { TECHNIQUES } from './techniques';

export interface AppState {
  // User technique progress
  userTechniques: Record<number, UserTechnique>;
  
  // Actions
  updateMastery: (techniqueId: number, level: MasteryLevel) => void;
  updateNotes: (techniqueId: number, notes: string) => void;
  toggleGamePlan: (techniqueId: number) => void;
  reorderGamePlan: (fromIndex: number, toIndex: number) => void;
  
  // Computed selectors
  getTechniqueWithProgress: (techniqueId: number) => TechniqueWithProgress | undefined;
  getAllTechniquesWithProgress: () => TechniqueWithProgress[];
  getProgressionTechniques: () => TechniqueWithProgress[];
  getGamePlanTechniques: () => TechniqueWithProgress[];
  getProgressByCategory: () => Record<Category, { total: number; learned: number; percentage: number }>;
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
      userTechniques: {},

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

      getTechniqueWithProgress: (techniqueId) => {
        const technique = TECHNIQUES.find(t => t.id === techniqueId);
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
        return TECHNIQUES.map(technique => {
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
    }),
    {
      name: 'bjj-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
