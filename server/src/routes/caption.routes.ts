import { Router } from 'express';
import { getCaptions, generateCaption } from '../controllers/caption.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getCaptions);
router.post('/generate', generateCaption);

export default router;
