import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/index.js';
import User from '../src/models/User.js';
import Slot from '../src/models/Slot.js';
import Appointment from '../src/models/Appointment.js';

jest.setTimeout(20000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Slot.deleteMany({});
  await Appointment.deleteMany({});
});

test('E2E: student/professor flow', async () => {
  // Register professor P1
  await request(app).post('/api/auth/register').send({ name: 'P1', email: 'p1@example.com', password: 'pass1', role: 'professor' });
  const lprof = await request(app).post('/api/auth/login').send({ email: 'p1@example.com', password: 'pass1' });
  const pToken = lprof.body.token;
  const prof = await User.findOne({ email: 'p1@example.com' });
  const profId = String(prof._id);

  // Professor creates two slots: T1 and T2
  const now = Date.now();
  const slotTimes = [
    { start: new Date(now + 3600 * 1000).toISOString(), end: new Date(now + 3600 * 1000 + 30 * 60 * 1000).toISOString() },
    { start: new Date(now + 7200 * 1000).toISOString(), end: new Date(now + 7200 * 1000 + 30 * 60 * 1000).toISOString() }
  ];
  const createRes = await request(app).post(`/api/professors/${profId}/slots`).set('Authorization', `Bearer ${pToken}`).send({ slots: slotTimes });
  expect(createRes.status).toBe(200);

  // Register Student A1 and login
  await request(app).post('/api/auth/register').send({ name: 'A1', email: 'a1@example.com', password: 's1', role: 'student' });
  const la1 = await request(app).post('/api/auth/login').send({ email: 'a1@example.com', password: 's1' });
  const a1Token = la1.body.token;

  // Student A1 fetches available slots
  const available = await request(app).get(`/api/professors/${profId}/slots`).set('Authorization', `Bearer ${a1Token}`);
  expect(available.status).toBe(200);
  const T1SlotId = available.body[0]._id;

  // Student A1 books T1
  const book1 = await request(app).post('/api/appointments').set('Authorization', `Bearer ${a1Token}`).send({ slotId: T1SlotId });
  expect(book1.status).toBe(200);

  // Register Student A2 and login
  await request(app).post('/api/auth/register').send({ name: 'A2', email: 'a2@example.com', password: 's2', role: 'student' });
  const la2 = await request(app).post('/api/auth/login').send({ email: 'a2@example.com', password: 's2' });
  const a2Token = la2.body.token;

  // Student A2 books T2
  const avail2 = await request(app).get(`/api/professors/${profId}/slots`).set('Authorization', `Bearer ${a2Token}`);
  const T2SlotId = avail2.body.find(s => s._id !== T1SlotId)._id;
  const book2 = await request(app).post('/api/appointments').set('Authorization', `Bearer ${a2Token}`).send({ slotId: T2SlotId });
  expect(book2.status).toBe(200);

  // Professor cancels appointment with Student A1
  const a1 = await User.findOne({ email: 'a1@example.com' });
  const appt = await Appointment.findOne({ student: a1._id });
  const cancel = await request(app).delete(`/api/appointments/${appt._id}`).set('Authorization', `Bearer ${pToken}`);
  expect(cancel.status).toBe(200);

  // Student A1 checks their appointments and should have no 'booked' ones
  const apptsA1 = await request(app).get('/api/appointments/me').set('Authorization', `Bearer ${a1Token}`);
  expect(apptsA1.status).toBe(200);
  const stillBooked = apptsA1.body.filter(a => a.status === 'booked');
  expect(stillBooked.length).toBe(0);
});
