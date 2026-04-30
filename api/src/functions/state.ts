import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getAppStateContainer } from '../shared/cosmos.js'
import { getAuthFromRequest } from '../shared/auth-utils.js'

// GET /api/state - get user's full app state
app.http('stateGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'state',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const db = await getDatabase()
      const container = getAppStateContainer(db)
      const { resources } = await container.items
        .query({
          query: 'SELECT * FROM c WHERE c.userId = @userId',
          parameters: [{ name: '@userId', value: auth.userId }]
        })
        .fetchAll()

      if (resources.length === 0) {
        return { jsonBody: { state: null } }
      }

      const doc = resources[0]
      return {
        jsonBody: {
          state: {
            belt: doc.belt,
            userTechniques: doc.userTechniques,
            customTechniques: doc.customTechniques,
            systems: doc.systems,
            decisionTrees: doc.decisionTrees,
          }
        }
      }
    } catch (error) {
      context.error('Get state error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// PUT /api/state - save user's full app state
app.http('statePut', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'state',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const body = await req.json() as {
        belt: string
        userTechniques: Record<string, any>
        customTechniques: any[]
        systems: any[]
        decisionTrees: any[]
      }

      const db = await getDatabase()
      const container = getAppStateContainer(db)

      const doc = {
        id: auth.userId,
        userId: auth.userId,
        belt: body.belt ?? 'white',
        userTechniques: body.userTechniques ?? {},
        customTechniques: body.customTechniques ?? [],
        systems: body.systems ?? [],
        decisionTrees: body.decisionTrees ?? [],
        updatedAt: new Date().toISOString()
      }

      await container.items.upsert(doc)
      return { jsonBody: { success: true } }
    } catch (error) {
      context.error('Save state error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})
