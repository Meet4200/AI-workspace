import { Router } from 'express';
import { getMeetings, createMeeting, deleteMeeting } from '../controllers/meeting.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getMeetings);
router.post('/', createMeeting);
router.delete('/:id', deleteMeeting);

export default router;
