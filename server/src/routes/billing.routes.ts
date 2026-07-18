import { Router } from 'express';
import { getPayments, buyCreditsPackage } from '../controllers/billing.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/payments', getPayments);
router.post('/buy-credits', buyCreditsPackage);

export default router;
