import { Router } from 'express';
import {
  getEmails,
  getEmailById,
  createEmail,
  updateEmail,
  deleteEmail,
  improveEmailAPI,
  translateEmailAPI
} from '../controllers/email.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Protect all email writer routes
router.use(requireAuth);

router.get('/', getEmails);
router.get('/:id', getEmailById);
router.post('/', createEmail);
router.put('/:id', updateEmail);
router.delete('/:id', deleteEmail);

// AI utilities
router.post('/ai/improve', improveEmailAPI);
router.post('/ai/translate', translateEmailAPI);

export default router;
