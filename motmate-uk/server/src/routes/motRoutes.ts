import { Router } from 'express';
import { checkMot, isMockMode } from '../services/motService';
import { cleanRegistration, isValidRegistration } from '../utils/registration';

const router = Router();

router.post('/check', async (req, res, next) => {
  try {
    const raw = req.body?.registration;
    if (!raw || typeof raw !== 'string') {
      return res.status(400).json({ error: 'Registration is required.' });
    }
    if (!isValidRegistration(raw)) {
      return res.status(400).json({ error: 'Please enter a valid UK registration number.' });
    }
    const result = await checkMot(cleanRegistration(raw));
    res.json({ mockMode: isMockMode(), result });
  } catch (err) {
    next(err);
  }
});

export default router;
