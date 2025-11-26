import { MongoMemoryServer } from 'mongodb-memory-server';
let mongod;

export async function startInMemoryMongo() {
  if (mongod) return mongod.getUri();
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}