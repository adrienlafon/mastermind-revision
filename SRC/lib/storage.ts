/**
 * Local storage helpers replacing window.spark.kv
 */

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
 * Simple user info based on a locally stored profile.
 * Replaces window.spark.user().
 */
export interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

const DEFAULT_USER: UserInfo = {
  avatarUrl: '',
  email: '',
  id: 'local-user',
  isOwner: true,
  login: 'Utilisateur',
}

export function getUser(): UserInfo {
  const saved = storage.get<UserInfo>('user-info')
  return saved ?? DEFAULT_USER
}
