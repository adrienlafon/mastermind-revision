import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getUsersContainer } from '../shared/cosmos.js'
import { hashPassword, generateSalt, signToken, getAuthFromRequest } from '../shared/auth-utils.js'

// POST /api/auth/register
app.http('authRegister', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/register',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await req.json() as { login: string; email: string; password: string }
      const { login, email, password } = body

      if (!login?.trim() || !email?.trim() || !password) {
        return { status: 400, jsonBody: { error: 'Tous les champs sont obligatoires.' } }
      }

      if (password.length < 6) {
        return { status: 400, jsonBody: { error: 'Le mot de passe doit contenir au moins 6 caractères.' } }
      }

      const db = await getDatabase()
      const container = getUsersContainer(db)

      // Check for existing user
      const { resources: existing } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE LOWER(c.login) = @login OR LOWER(c.email) = @email',
          parameters: [
            { name: '@login', value: login.toLowerCase() },
            { name: '@email', value: email.toLowerCase() }
          ]
        })
        .fetchAll()

      if (existing.length > 0) {
        const conflict = existing[0].login.toLowerCase() === login.toLowerCase() 
          ? 'Ce nom d\'utilisateur est déjà pris.'
          : 'Cet email est déjà utilisé.'
        return { status: 409, jsonBody: { error: conflict } }
      }

      // Check if first user (becomes owner)
      const { resources: allUsers } = await container.items.query('SELECT VALUE COUNT(1) FROM c').fetchAll()
      const isFirstUser = allUsers[0] === 0

      const salt = generateSalt()
      const passwordHash = await hashPassword(password, salt)
      const userId = crypto.randomUUID()

      const user = {
        id: userId,
        login: login.trim(),
        email: email.trim(),
        passwordHash,
        salt,
        isOwner: isFirstUser,
        createdAt: new Date().toISOString()
      }

      await container.items.create(user)

      const token = signToken({ userId: user.id, login: user.login, isOwner: user.isOwner })

      return {
        status: 201,
        jsonBody: {
          token,
          user: { id: user.id, login: user.login, email: user.email, isOwner: user.isOwner, avatarUrl: '' }
        }
      }
    } catch (error) {
      context.error('Register error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// POST /api/auth/login
app.http('authLogin', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const body = await req.json() as { login: string; password: string }
      const { login, password } = body

      if (!login?.trim() || !password) {
        return { status: 400, jsonBody: { error: 'Veuillez remplir tous les champs.' } }
      }

      const db = await getDatabase()
      const container = getUsersContainer(db)

      const { resources: users } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE LOWER(c.login) = @login OR LOWER(c.email) = @login',
          parameters: [{ name: '@login', value: login.toLowerCase() }]
        })
        .fetchAll()

      if (users.length === 0) {
        return { status: 401, jsonBody: { error: 'Identifiant ou mot de passe incorrect.' } }
      }

      const user = users[0]
      const hash = await hashPassword(password, user.salt)

      if (hash !== user.passwordHash) {
        return { status: 401, jsonBody: { error: 'Identifiant ou mot de passe incorrect.' } }
      }

      const token = signToken({ userId: user.id, login: user.login, isOwner: user.isOwner })

      return {
        jsonBody: {
          token,
          user: { id: user.id, login: user.login, email: user.email, isOwner: user.isOwner, avatarUrl: '' }
        }
      }
    } catch (error) {
      context.error('Login error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// GET /api/auth/me
app.http('authMe', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const db = await getDatabase()
      const container = getUsersContainer(db)
      const { resource: user } = await container.item(auth.userId, auth.userId).read()

      if (!user) return { status: 404, jsonBody: { error: 'Utilisateur non trouvé.' } }

      return {
        jsonBody: {
          user: { id: user.id, login: user.login, email: user.email, isOwner: user.isOwner, avatarUrl: '' }
        }
      }
    } catch (error) {
      context.error('Auth me error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})
