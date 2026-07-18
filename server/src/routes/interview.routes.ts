import { Router } from 'express';
import { getInterviews, generateQuestions, submitInterview } from '../controllers/interview.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getInterviews);
router.post('/questions', generateQuestions);
router.post('/submit', submitInterview);

export default router;
