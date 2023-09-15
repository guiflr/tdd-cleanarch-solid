import { MongoClient, type Collection } from 'mongodb'
import { getUri } from './get-uri'
import type { MongoMemoryServer } from 'mongodb-memory-server'

export const mongoHelper: MongoHelper = {
  client: null as any as MongoClient,
  memoryServer: null as any as MongoMemoryServer,
  async connect() {
    const { uri, mongoMemory } = await getUri()
    this.memoryServer = mongoMemory
    const mongoClient = await MongoClient.connect(uri)
    this.client = mongoClient
    return mongoClient
  },
  async disconnect() {
    await this.client.close()
    this.client = null as any as MongoClient
  },
  async getCollection(collection) {
    if (!this.client) {
      await this.connect()
    }

    return this.client.db().collection(collection)
  },
  async disconnectMongoMemory() {
    if (this.memoryServer) {
      await this.memoryServer.stop()
    }
  }
}

interface MongoHelper {
  client: MongoClient
  connect: () => Promise<MongoClient>
  disconnect: () => Promise<void>
  getCollection: (collection: string) => Promise<Collection>
  disconnectMongoMemory: () => Promise<void>
  memoryServer: MongoMemoryServer | null
}
