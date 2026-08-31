import { Router } from 'express';
import { getLogs, getLogByDate, saveDailyLog } from '../controllers/logController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { saveLogSchema } from '../schemas/logSchemas.js';

const router = Router();

router.use(authenticate);

router.get('/', getLogs);
router.get('/:date', getLogByDate);
router.post('/:date', validate(saveLogSchema), saveDailyLog);

export default router;
