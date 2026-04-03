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
 * User info
 */
export interface UserInfo {
  avatarUrl: string
  email: string
  id: string
  isOwner: boolean
  login: string
}

interface StoredUser {
  id: string
  login: string
  email: string
  passwordHash: string
  isOwner: boolean
  createdAt: string
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function getUsers(): StoredUser[] {
  return storage.get<StoredUser[]>('registered-users') ?? []
}

function saveUsers(users: StoredUser[]): void {
  storage.set('registered-users', users)
}

export async function registerUser(login: string, email: string, password: string): Promise<{ success: boolean; error?: string; user?: UserInfo }> {
  const users = getUsers()

  if (users.some(u => u.login.toLowerCase() === login.toLowerCase())) {
    return { success: false, error: 'Ce nom d\'utilisateur est déjà pris.' }
  }

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Cet email est déjà utilisé.' }
  }

  const passwordHash = await hashPassword(password)
  const isFirstUser = users.length === 0

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    login,
    email,
    passwordHash,
    isOwner: isFirstUser,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])

  const userInfo: UserInfo = {
    avatarUrl: '',
    email: newUser.email,
    id: newUser.id,
    isOwner: newUser.isOwner,
    login: newUser.login,
  }

  storage.set('current-user', userInfo)
  return { success: true, user: userInfo }
}

export async function loginUser(login: string, password: string): Promise<{ success: boolean; error?: string; user?: UserInfo }> {
  const users = getUsers()
  const passwordHash = await hashPassword(password)

  const found = users.find(
    u => (u.login.toLowerCase() === login.toLowerCase() || u.email.toLowerCase() === login.toLowerCase()) && u.passwordHash === passwordHash
  )

  if (!found) {
    return { success: false, error: 'Identifiant ou mot de passe incorrect.' }
  }

  const userInfo: UserInfo = {
    avatarUrl: '',
    email: found.email,
    id: found.id,
    isOwner: found.isOwner,
    login: found.login,
  }

  storage.set('current-user', userInfo)
  return { success: true, user: userInfo }
}

export function logoutUser(): void {
  storage.remove('current-user')
}

export function getCurrentUser(): UserInfo | null {
  return storage.get<UserInfo>('current-user')
}
