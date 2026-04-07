import { create } from 'zustand'
import { type AuthUser, getMe, login as apiLogin, register as apiRegister, logout as apiLogout, loadStateFromCloud, saveStateToCloud } from './auth'
import { useAppStore } from './store'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null

  init: () => Promise<void>
  login: (login: string, password: string) => Promise<void>
  register: (login: string, password: string) => Promise<void>
  logout: () => void
  syncToCloud: () => Promise<void>
  loadFromCloud: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: true,
  error: null,

  init: async () => {
    set({ loading: true, error: null })
    const user = await getMe()
    set({ user, loading: false })
    if (user) {
      // Load state from cloud on init
      await get().loadFromCloud()
    }
  },

  login: async (login, password) => {
    set({ error: null, loading: true })
    try {
      const res = await apiLogin(login, password)
      set({ user: res.user, loading: false })
      await get().loadFromCloud()
    } catch (e: any) {
      set({ error: e.message, loading: false })
      throw e
    }
  },

  register: async (login, password) => {
    set({ error: null, loading: true })
    try {
      const res = await apiRegister(login, password)
      set({ user: res.user, loading: false })
      // First registration: push local state to cloud
      await get().syncToCloud()
    } catch (e: any) {
      set({ error: e.message, loading: false })
      throw e
    }
  },

  logout: () => {
    apiLogout()
    set({ user: null, error: null })
  },

  syncToCloud: async () => {
    const appState = useAppStore.getState()
    await saveStateToCloud({
      belt: appState.belt,
      userTechniques: appState.userTechniques,
      customTechniques: appState.customTechniques,
      systems: appState.systems,
      baseOverrides: appState.baseOverrides,
    })
  },

  loadFromCloud: async () => {
    const state = await loadStateFromCloud()
    if (state) {
      useAppStore.setState({
        belt: state.belt ?? 'white',
        userTechniques: state.userTechniques ?? {},
        customTechniques: state.customTechniques ?? [],
        systems: state.systems ?? [],
        baseOverrides: state.baseOverrides ?? {},
      })
    }
  },
}))
