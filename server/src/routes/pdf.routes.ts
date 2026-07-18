import { Router } from 'express';
import {
  getDocuments,
  uploadDocument,
  getPdfChats,
  getChatDetails,
  sendChatMessage,
  deleteDocument
} from '../controllers/pdf.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Protect all PDF RAG routes
router.use(requireAuth);

router.get('/documents', getDocuments);
router.post('/upload', uploadDocument);
router.get('/chats', getPdfChats);
router.get('/chats/:id', getChatDetails);
router.post('/chats/:id', sendChatMessage);
router.delete('/documents/:id', deleteDocument);

export default router;
