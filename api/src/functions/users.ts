import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getUsersContainer } from '../shared/cosmos.js'
import { getAuthFromRequest } from '../shared/auth-utils.js'

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
