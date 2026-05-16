import { Router } from 'express';
import { getMotData } from '../services/motService';
import { cleanRegistration, isValidRegistration } from '../utils/validation';

const router = Router();

router.post('/check', async (req, res, next) => {
  try {
    const { registration } = req.body ?? {};
    if (typeof registration !== 'string' || registration.trim().length === 0) {
      return res.status(400).json({ error: 'registration is required' });
    }
    if (!isValidRegistration(registration)) {
      return res.status(400).json({ error: 'registration is invalid' });
    }
    const data = await getMotData(cleanRegistration(registration));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
