import { MongoMemoryServer } from 'mongodb-memory-server'

interface MongoURI {
  uri: string
  mongoMemory: MongoMemoryServer
}

export const getUri = async (): Promise<MongoURI> => {
  const mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  return { mongoMemory: mongoServer, uri: mongoUri }
}
