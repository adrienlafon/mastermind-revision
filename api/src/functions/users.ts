import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getUsersContainer, getProgressContainer } from '../shared/cosmos.js'
import { getAuthFromRequest, hashPassword, generateSalt } from '../shared/auth-utils.js'

// GET /api/users - list all users (admin only)
app.http('usersGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }
    if (!auth.isOwner) return { status: 403, jsonBody: { error: 'Accès réservé à l\'administrateur.' } }

    try {
      const db = await getDatabase()
      const container = getUsersContainer(db)
      const { resources: users } = await container.items
        .query('SELECT c.id, c.login, c.email, c.isOwner, c.createdAt FROM c')
        .fetchAll()

      return { jsonBody: { users } }
    } catch (error) {
      context.error('Get users error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// DELETE /api/users/{userId} - delete a user (admin only)
app.http('usersDelete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'users/{userId}',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }
    if (!auth.isOwner) return { status: 403, jsonBody: { error: 'Accès réservé à l\'administrateur.' } }

    const userId = req.params.userId
    if (!userId) return { status: 400, jsonBody: { error: 'userId est requis.' } }

    // Prevent self-deletion
    if (userId === auth.userId) {
      return { status: 400, jsonBody: { error: 'Vous ne pouvez pas supprimer votre propre compte.' } }
    }

    try {
      const db = await getDatabase()
      const container = getUsersContainer(db)
      await container.item(userId, userId).delete()
      return { jsonBody: { success: true } }
    } catch (error) {
      context.error('Delete user error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// GET /api/users/{userId}/progress - get a specific user's progress (admin only)
app.http('usersProgress', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users/{userId}/progress',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }
    if (!auth.isOwner) return { status: 403, jsonBody: { error: 'Accès réservé à l\'administrateur.' } }

    const userId = req.params.userId
    if (!userId) return { status: 400, jsonBody: { error: 'userId est requis.' } }

    try {
      const db = await getDatabase()
      const container = getProgressContainer(db)
      const { resources: progress } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId',
          parameters: [{ name: '@userId', value: userId }]
        })
        .fetchAll()

      return { jsonBody: { progress } }
    } catch (error) {
      context.error('Get user progress error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// PUT /api/users/{userId}/password - reset a user's password (admin only)
app.http('usersResetPassword', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'users/{userId}/password',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }
    if (!auth.isOwner) return { status: 403, jsonBody: { error: 'Accès réservé à l\'administrateur.' } }

    const userId = req.params.userId
    if (!userId) return { status: 400, jsonBody: { error: 'userId est requis.' } }

    try {
      const body = await req.json() as { newPassword: string }
      const { newPassword } = body

      if (!newPassword || newPassword.length < 6) {
        return { status: 400, jsonBody: { error: 'Le mot de passe doit contenir au moins 6 caractères.' } }
      }

      const db = await getDatabase()
      const container = getUsersContainer(db)
      const { resource: user } = await container.item(userId, userId).read()

      if (!user) {
        return { status: 404, jsonBody: { error: 'Utilisateur non trouvé.' } }
      }

      const salt = generateSalt()
      const passwordHash = await hashPassword(newPassword, salt)

      await container.item(userId, userId).replace({
        ...user,
        salt,
        passwordHash,
      })

      return { jsonBody: { success: true } }
    } catch (error) {
      context.error('Reset password error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})
