import { Router } from 'express';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getAIExtractedScore,
  suggestSkillsAPI,
  rewriteTextAPI,
  generateSummaryAPI,
  generateExperienceAPI
} from '../controllers/resume.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Protect all resume routes
router.use(requireAuth);

router.get('/', getResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

// AI helpers
router.post('/score', getAIExtractedScore);
router.get('/ai/skills', suggestSkillsAPI);
router.post('/ai/rewrite', rewriteTextAPI);
router.post('/ai/summary', generateSummaryAPI);
router.post('/ai/experience', generateExperienceAPI);

export default router;
