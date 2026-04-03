/**
 * API client for the Azure Functions backend.
 * Falls back to localStorage when the API is not available.
 */

const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('auth-token')
}

function setToken(token: string) {
  localStorage.setItem('auth-token', token)
}

export function clearToken() {
  localStorage.removeItem('auth-token')
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<{ ok: boolean; data?: T; error?: string }> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}`, 'x-auth-token': token } : {}),
    ...(options.headers as Record<string, string> ?? {})
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const data = await res.json()

    if (!res.ok) {
      return { ok: false, error: data.error || `Erreur ${res.status}` }
    }
    return { ok: true, data }
  } catch {
    return { ok: false, error: 'API non disponible. Mode hors-ligne actif.' }
  }
}

// --- Auth ---

export interface ApiUser {
  id: string
  login: string
  email: string
  isOwner: boolean
  avatarUrl: string
}

export async function apiRegister(login: string, email: string, password: string) {
  const result = await apiFetch<{ token: string; user: ApiUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ login, email, password })
  })
  if (result.ok && result.data) {
    setToken(result.data.token)
  }
  return result
}

export async function apiLogin(login: string, password: string) {
  const result = await apiFetch<{ token: string; user: ApiUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ login, password })
  })
  if (result.ok && result.data) {
    setToken(result.data.token)
  }
  return result
}

export async function apiGetMe() {
  return apiFetch<{ user: ApiUser }>('/auth/me')
}

// --- Points ---

export async function apiGetPoints() {
  return apiFetch<{ points: any[] }>('/points')
}

export async function apiUpdatePoints(points: any[]) {
  return apiFetch<{ success: boolean }>('/points', {
    method: 'PUT',
    body: JSON.stringify({ points })
  })
}

// --- Progress ---

export async function apiGetProgress() {
  return apiFetch<{ progress: any[] }>('/progress')
}

export async function apiUpdateProgress(pointId: number, mastery: string, notes?: string, srData?: any) {
  return apiFetch<{ success: boolean }>('/progress', {
    method: 'PUT',
    body: JSON.stringify({ pointId, mastery, notes, srData })
  })
}

export async function apiBulkProgress(entries: Array<{ pointId: number; mastery: string; notes?: string; srData?: any }>) {
  return apiFetch<{ success: boolean }>('/progress/bulk', {
    method: 'PUT',
    body: JSON.stringify({ entries })
  })
}

// --- Users (admin) ---

export async function apiGetUsers() {
  return apiFetch<{ users: any[] }>('/users')
}

export async function apiDeleteUser(userId: string) {
  return apiFetch<{ success: boolean }>(`/users/${encodeURIComponent(userId)}`, {
    method: 'DELETE'
  })
}

export async function apiGetUserProgress(userId: string) {
  return apiFetch<{ progress: any[] }>(`/users/${encodeURIComponent(userId)}/progress`)
}

/**
 * Check if the API is available
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { method: 'GET' })
    // 401 means API is up but not authenticated - that's fine
    return res.status !== 404
  } catch {
    return false
  }
}
