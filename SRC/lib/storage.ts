/**
 * Local storage helpers + API integration
 */

import { apiRegister, apiLogin, apiGetMe, clearToken } from './api-client'

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },
}

/**
 * User info
 */
export interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

export async function registerUser(login: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserInfo }> {
  const result = await apiRegister(login, email, password)
  
  if (result.ok && result.data) {
    const user: UserInfo = result.data.user
    storage.set('current-user', user)
    return { success: true, user }
  }
  
  return { success: false, error: result.error ?? 'Erreur lors de l\'inscription.' }
}

export async function loginUser(login: string, password: string): Promise<{ success: boolean; error?: string; user?: UserInfo }> {
  const result = await apiLogin(login, password)
  
  if (result.ok && result.data) {
    const user: UserInfo = result.data.user
    storage.set('current-user', user)
    return { success: true, user }
  }
  
  return { success: false, error: result.error ?? 'Erreur lors de la connexion.' }
}

export function logoutUser(): void {
  clearToken()
  storage.remove('current-user')
}

export async function getCurrentUser(): Promise<UserInfo | null> {
  // First check if we have a token and validate it
  const token = localStorage.getItem('auth-token')
  if (token) {
    const result = await apiGetMe()
    if (result.ok && result.data) {
      const user: UserInfo = result.data.user
      storage.set('current-user', user)
      return user
    }
    // Token is invalid, clear it
    clearToken()
    storage.remove('current-user')
    return null
  }
  
  // No token, no user
  return null
}
