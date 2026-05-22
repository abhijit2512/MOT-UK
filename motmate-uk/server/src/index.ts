import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initSchema } from './db/database';
import motRoutes from './routes/motRoutes';
import listingsRoutes from './routes/listingsRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { isMockMode } from './services/motService';

const PORT = Number(process.env.PORT ?? 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

const app = express();

// TODO before production: tighten CORS, add helmet, rate limiting, and authentication.
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', mockMode: isMockMode(), time: new Date().toISOString() });
});

app.use('/api/mot', motRoutes);
app.use('/api/listings', listingsRoutes);

app.use(notFound);
app.use(errorHandler);

initSchema();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[motmate-server] Listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[motmate-server] MOT mock mode: ${isMockMode() ? 'ON' : 'OFF'}`);
});
