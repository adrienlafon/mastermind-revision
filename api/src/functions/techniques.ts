import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'
import { getDatabase, getTechniquesContainer } from '../shared/cosmos.js'
import { getAuthFromRequest } from '../shared/auth-utils.js'

const GLOBAL_DOC_ID = 'global'

// GET /api/techniques - get shared techniques (baseOverrides + sharedTechniques)
app.http('techniquesGet', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'techniques',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }

    try {
      const db = await getDatabase()
      const container = getTechniquesContainer(db)

      try {
        const { resource } = await container.item(GLOBAL_DOC_ID, GLOBAL_DOC_ID).read()
        if (resource) {
          return {
            jsonBody: {
              baseOverrides: resource.baseOverrides ?? {},
              sharedTechniques: resource.sharedTechniques ?? [],
            }
          }
        }
      } catch {
        // Document doesn't exist yet
      }

      return { jsonBody: { baseOverrides: {}, sharedTechniques: [] } }
    } catch (error) {
      context.error('Get techniques error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})

// PUT /api/techniques - admin only, save shared techniques
app.http('techniquesPut', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'techniques',
  handler: async (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    const auth = getAuthFromRequest(req)
    if (!auth) return { status: 401, jsonBody: { error: 'Non authentifié.' } }
    if (!auth.isOwner) return { status: 403, jsonBody: { error: 'Accès réservé à l\'administrateur.' } }

    try {
      const body = await req.json() as {
        baseOverrides: Record<string, any>
        sharedTechniques: any[]
      }

      const db = await getDatabase()
      const container = getTechniquesContainer(db)

      const doc = {
        id: GLOBAL_DOC_ID,
        baseOverrides: body.baseOverrides ?? {},
        sharedTechniques: body.sharedTechniques ?? [],
        updatedAt: new Date().toISOString()
      }

      await container.items.upsert(doc)
      return { jsonBody: { success: true } }
    } catch (error) {
      context.error('Save techniques error:', error)
      return { status: 500, jsonBody: { error: 'Erreur interne du serveur.' } }
    }
  }
})
