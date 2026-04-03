import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getPointsContainer } from '../shared/cosmos.js'
import { getAuthFromRequest } from '../shared/auth-utils.js'

// GET /api/points - get all knowledge points
app.http('pointsGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'points',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const db = await getDatabase()
      const container = getPointsContainer(db)
      const { resources: points } = await container.items
        .query('SELECT * FROM c ORDER BY c.pointId')
        .fetchAll()

      return { jsonBody: { points } }
    } catch (error) {
      context.error('Get points error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// PUT /api/points - update all knowledge points (admin only)
app.http('pointsPut', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'points',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }
    if (!auth.isOwner) return { status: 403, jsonBody: { error: 'Accès réservé à l\'administrateur.' } }

    try {
      const body = await req.json() as { points: any[] }
      if (!Array.isArray(body.points)) {
        return { status: 400, jsonBody: { error: 'Format invalide.' } }
      }

      const db = await getDatabase()
      const container = getPointsContainer(db)

      // Delete existing points
      const { resources: existing } = await container.items.query('SELECT c.id FROM c').fetchAll()
      for (const item of existing) {
        await container.item(item.id, item.id).delete()
      }

      // Insert new points
      for (const point of body.points) {
        await container.items.create({
          id: String(point.id),
          pointId: point.id,
          title: point.title,
          description: point.description,
          mastery: point.mastery || 'weak',
          notes: point.notes || '',
          videoLink: point.videoLink || ''
        })
      }

      return { jsonBody: { success: true, count: body.points.length } }
    } catch (error) {
      context.error('Update points error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})
