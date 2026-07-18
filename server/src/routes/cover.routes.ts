import { Router } from 'express';
import {
  getCoverLetters,
  getCoverLetterById,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter
} from '../controllers/cover.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Protect all cover letter routes
router.use(requireAuth);

router.get('/', getCoverLetters);
router.get('/:id', getCoverLetterById);
router.post('/', createCoverLetter);
router.put('/:id', updateCoverLetter);
router.delete('/:id', deleteCoverLetter);

export default router;
