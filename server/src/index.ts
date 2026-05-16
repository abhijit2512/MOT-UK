import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb } from './db/database';
import healthRouter from './routes/health';
import motRouter from './routes/mot';
import listingsRouter from './routes/listings';
import { errorHandler } from './middleware/errorHandler';

// TODO (production security):
//  - Add authentication & authorisation before any public deployment.
//  - Add rate limiting (e.g. express-rate-limit) on /api/mot and /api/listings.
//  - Move secrets to a real secret store, not .env files.
//  - Run behind HTTPS only.

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/health', healthRouter);
app.use('/api/mot', motRouter);
app.use('/api/listings', listingsRouter);

app.use(errorHandler);

initDb();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[motmate] server listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[motmate] mock MOT mode: ${(process.env.DVSA_MOT_MOCK_MODE ?? 'true').toLowerCase() !== 'false'}`);
});
