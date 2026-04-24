import express from 'express';
import cookieParser from 'cookie-parser';
import bookingrouter from '../../routes/BookingRoute.js';

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/v1/bookings', bookingrouter);
  return app;
}

