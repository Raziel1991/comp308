import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDb } from '../src/config/db.js';
import { createApp } from '../src/app.js';

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connectDb(uri);
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  // Clean DB
  const collections = Object.keys(mongoose.connection.collections);
  for (const name of collections) {
    await mongoose.connection.collections[name].deleteMany({});
  }
});

test('registers and logs in user Raz with password 1234567890', async () => {
  const creds = { username: 'Raz', password: '1234567890' };

  // Register
  const reg = await request(app).post('/api/auth/register').send(creds).expect(201);
  expect(reg.body).toHaveProperty('username', 'Raz');
  expect(reg.headers['set-cookie']).toBeDefined();

  // Logout to clear cookie (simulates fresh client)
  await request(app).post('/api/auth/logout').expect(200);

  // Login
  const login = await request(app).post('/api/auth/login').send(creds).expect(200);
  expect(login.body).toHaveProperty('username', 'Raz');
  expect(login.headers['set-cookie']).toBeDefined();

  const cookie = login.headers['set-cookie'];

  // Access protected /me with cookie
  const me = await request(app).get('/api/auth/me').set('Cookie', cookie).expect(200);
  expect(me.body).toHaveProperty('username', 'Raz');
});