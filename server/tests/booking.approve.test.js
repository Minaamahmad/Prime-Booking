import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { createTestApp } from './helpers/createTestApp.js';
import User from '../Models/Users.js';
import Hotel from '../Models/Hotels.js';
import Booking from '../Models/Bookings.js';
import Room from '../Models/Rooms.js';

const signToken = ({ id, role }) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('PUT /v1/bookings/:id/approve', () => {
  let mongod;
  let app;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    app = createTestApp();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  });

  beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
  });

  it('allows the hotel owner to approve a pending booking', async () => {
    const owner = await User.create({
      name: 'Owner',
      email: 'owner@example.com',
      role: 'Owner',
      provider: 'google',
      provider_id: 'owner-google-id',
    });

    const guest = await User.create({
      name: 'Guest',
      email: 'guest@example.com',
      role: 'Guest',
      provider: 'google',
      provider_id: 'guest-google-id',
    });

    const hotel = await Hotel.create({
      owner_id: owner._id,
      name: 'Test Hotel',
      location: 'Test City',
      description: 'Test',
      images: [],
    });

    const room = await Room.create({
      hotel_id: hotel._id,
      type: 'Single',
      price_per_night: 100,
      total_stock: 5,
      images: [],
    });

    const booking = await Booking.create({
      user_id: guest._id,
      hotel_id: hotel._id,
      room_id: room._id,
      check_in: new Date('2030-01-01'),
      check_out: new Date('2030-01-02'),
      status: 'Pending',
      total_price: 100,
    });

    const token = signToken({ id: owner._id.toString(), role: 'Owner' });

    const res = await request(app)
      .put(`/v1/bookings/${booking._id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('updatedBooking');
    expect(res.body.updatedBooking).toHaveProperty('status', 'Confirmed');

    const fromDb = await Booking.findById(booking._id);
    expect(fromDb.status).toBe('Confirmed');
  });

  it('rejects approval when the authenticated owner does not own the hotel (403)', async () => {
    const ownerA = await User.create({
      name: 'OwnerA',
      email: 'ownera@example.com',
      role: 'Owner',
      provider: 'google',
      provider_id: 'ownerA-google-id',
    });

    const ownerB = await User.create({
      name: 'OwnerB',
      email: 'ownerb@example.com',
      role: 'Owner',
      provider: 'google',
      provider_id: 'ownerB-google-id',
    });

    const guest = await User.create({
      name: 'Guest2',
      email: 'guest2@example.com',
      role: 'Guest',
      provider: 'google',
      provider_id: 'guest2-google-id',
    });

    const hotel = await Hotel.create({
      owner_id: ownerA._id,
      name: 'Hotel A',
      location: 'City',
    });

    const room = await Room.create({
      hotel_id: hotel._id,
      type: 'Double',
      price_per_night: 50,
      total_stock: 2,
      images: [],
    });

    const booking = await Booking.create({
      user_id: guest._id,
      hotel_id: hotel._id,
      room_id: room._id,
      check_in: new Date('2030-02-01'),
      check_out: new Date('2030-02-02'),
      status: 'Pending',
      total_price: 50,
    });

    const token = signToken({ id: ownerB._id.toString(), role: 'Owner' });

    const res = await request(app)
      .put(`/v1/bookings/${booking._id}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);

    expect(res.body?.message).toBeTruthy();
  });

  it('returns 404 when booking does not exist', async () => {
    const owner = await User.create({
      name: 'Owner3',
      email: 'owner3@example.com',
      role: 'Owner',
      provider: 'google',
      provider_id: 'owner3-google-id',
    });

    const token = signToken({ id: owner._id.toString(), role: 'Owner' });
    const fakeId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .put(`/v1/bookings/${fakeId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body?.message).toMatch(/not found/i);
  });
});

