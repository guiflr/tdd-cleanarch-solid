import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, type Collection } from 'mongodb'

interface Mongo {
  mongoClient: MongoClient
  mockServer: MongoMemoryServer
}

class MongoHelper {
  async connect(): Promise<Mongo> {
    const mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    const mongoClient = await MongoClient.connect(mongoUri)
    return { mongoClient, mockServer: mongoServer }
  }

  async disconnect(): Promise<void> {
    const { mockServer, mongoClient } = await this.connect()

    await mongoClient.close()

    await mockServer.stop()
  }

  async getCollection(name: string): Promise<Collection> {
    const { mongoClient } = await this.connect()

    return mongoClient.db().collection(name)
  }
}

export default new MongoHelper()
