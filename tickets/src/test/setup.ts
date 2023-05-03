import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signin(): string[]
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'JWT_KEY'

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  const userPayload = { id: 'test-id', email: 'test@test.com' }
  const userJwt = jwt.sign(userPayload, process.env.JWT_KEY!);

  const session = JSON.stringify({ jwt: userJwt });
  const base64 = Buffer.from(session).toString('base64')
  
  return [`session=${base64}`]
};