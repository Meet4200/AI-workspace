import { Router } from 'express';
import { getAdminStats, getAdminUsers, updateAdminUserRole } from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['ADMIN']));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.put('/users/role', updateAdminUserRole);

export default router;
