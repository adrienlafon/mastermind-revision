const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('auth-token')
}

function getHeaders(): Record<string, string> {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    headers['x-auth-token'] = token
  }
  return headers
}

export interface AuthUser {
  id: string
  login: string
  email: string
  isOwner: boolean
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export async function register(login: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'inscription')
  localStorage.setItem('auth-token', data.token)
  return data
}

export async function login(login: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur de connexion')
  localStorage.setItem('auth-token', data.token)
  return data
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getToken()
  if (!token) return null
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() })
    if (!res.ok) {
      localStorage.removeItem('auth-token')
      return null
    }
    const data = await res.json()
    return data.user
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('auth-token')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

// ─── State sync ──────────────────────────────────────────────

export async function loadStateFromCloud(): Promise<any | null> {
  const res = await fetch(`${API_BASE}/state`, { headers: getHeaders() })
  if (!res.ok) return null
  const data = await res.json()
  return data.state
}

export async function saveStateToCloud(state: {
  belt: string
  userTechniques: Record<string, any>
  customTechniques: any[]
  systems: any[]
  baseOverrides: Record<string, any>
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/state`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(state),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Admin: users ────────────────────────────────────────────

export interface CloudUser {
  id: string
  login: string
  email: string
  isOwner: boolean
  createdAt: string
}

export async function getUsers(): Promise<CloudUser[]> {
  const res = await fetch(`${API_BASE}/users`, { headers: getHeaders() })
  if (!res.ok) return []
  const data = await res.json()
  return data.users
}

export async function deleteUser(userId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return res.ok
}

export async function getUserProgress(userId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(userId)}/progress`, { headers: getHeaders() })
  if (!res.ok) return []
  const data = await res.json()
  return data.progress
}
