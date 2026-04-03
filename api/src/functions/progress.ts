import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getProgressContainer } from '../shared/cosmos.js'
import { getAuthFromRequest } from '../shared/auth-utils.js'

// GET /api/progress - get user's progress
app.http('progressGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'progress',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const db = await getDatabase()
      const container = getProgressContainer(db)
      const { resources: entries } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId',
          parameters: [{ name: '@userId', value: auth.userId }]
        })
        .fetchAll()

      return { jsonBody: { progress: entries } }
    } catch (error) {
      context.error('Get progress error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// PUT /api/progress - update a user's progress for a single point
app.http('progressPut', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'progress',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const body = await req.json() as {
        pointId: number
        mastery: string
        notes?: string
        srData?: any
      }

      if (!body.pointId || !body.mastery) {
        return { status: 400, jsonBody: { error: 'pointId et mastery sont requis.' } }
      }

      const validMastery = ['weak', 'progress', 'mastered']
      if (!validMastery.includes(body.mastery)) {
        return { status: 400, jsonBody: { error: 'Mastery invalide.' } }
      }

      const db = await getDatabase()
      const container = getProgressContainer(db)

      const docId = `${auth.userId}-${body.pointId}`
      const progressDoc = {
        id: docId,
        userId: auth.userId,
        pointId: body.pointId,
        mastery: body.mastery,
        notes: body.notes ?? '',
        srData: body.srData ?? null,
        updatedAt: new Date().toISOString()
      }

      await container.items.upsert(progressDoc)
      return { jsonBody: { success: true } }
    } catch (error) {
      context.error('Update progress error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// PUT /api/progress/bulk - bulk save all user progress
app.http('progressBulk', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'progress/bulk',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const body = await req.json() as {
        entries: Array<{ pointId: number; mastery: string; notes?: string; srData?: any }>
      }

      if (!Array.isArray(body.entries)) {
        return { status: 400, jsonBody: { error: 'Format invalide.' } }
      }

      const db = await getDatabase()
      const container = getProgressContainer(db)

      for (const entry of body.entries) {
        const docId = `${auth.userId}-${entry.pointId}`
        await container.items.upsert({
          id: docId,
          userId: auth.userId,
          pointId: entry.pointId,
          mastery: entry.mastery,
          notes: entry.notes ?? '',
          srData: entry.srData ?? null,
          updatedAt: new Date().toISOString()
        })
      }

      return { jsonBody: { success: true, count: body.entries.length } }
    } catch (error) {
      context.error('Bulk progress error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})
