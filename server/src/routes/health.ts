import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'motmate-uk-server',
    motMockMode: (process.env.DVSA_MOT_MOCK_MODE ?? 'true').toLowerCase() !== 'false',
    time: new Date().toISOString(),
  });
});

export default router;
