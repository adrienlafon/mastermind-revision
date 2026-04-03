import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { HttpRequest } from '@azure/functions'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'

export interface JwtPayload {
  userId: string
  login: string
  isOwner: boolean
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export function getAuthFromRequest(req: HttpRequest): JwtPayload | null {
  // Try standard Authorization header first
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const result = verifyToken(authHeader.slice(7))
    if (result) return result
  }
  // Fallback: custom header (Azure SWA may strip Authorization)
  const customToken = req.headers.get('x-auth-token')
  if (customToken) {
    return verifyToken(customToken)
  }
  return null
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derived) => {
      if (err) reject(err)
      else resolve(derived.toString('hex'))
    })
  })
}

export function generateSalt(): string {
  return crypto.randomBytes(32).toString('hex')
}
