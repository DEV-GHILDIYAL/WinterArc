import { Router } from 'express';
import { getStreakStats, getStatsSummary } from '../controllers/statsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/streak', getStreakStats);
router.get('/summary', getStatsSummary);

export default router;
