import { CosmosClient, Database } from '@azure/cosmos'

let database: Database | null = null

export async function getDatabase(): Promise<Database> {
  if (database) return database

  const endpoint = process.env.COSMOS_ENDPOINT
  const key = process.env.COSMOS_KEY
  const dbName = process.env.COSMOS_DATABASE || 'mastermind'

  if (!endpoint || !key) {
    throw new Error('COSMOS_ENDPOINT and COSMOS_KEY environment variables are required')
  }

  const client = new CosmosClient({ endpoint, key })

  const { database: db } = await client.databases.createIfNotExists({ id: dbName })
  
  // Ensure containers exist
  await db.containers.createIfNotExists({ id: 'users', partitionKey: '/id' })
  await db.containers.createIfNotExists({ id: 'points', partitionKey: '/id' })
  await db.containers.createIfNotExists({ id: 'progress', partitionKey: '/userId' })
  await db.containers.createIfNotExists({ id: 'appstate', partitionKey: '/userId' })

  database = db
  return db
}

export function getUsersContainer(db: Database) {
  return db.container('users')
}

export function getPointsContainer(db: Database) {
  return db.container('points')
}

export function getProgressContainer(db: Database) {
  return db.container('progress')
}

export function getAppStateContainer(db: Database) {
  return db.container('appstate')
}
