import { Request, Response } from 'express';
import prisma from '../config/db.js';

// Get all uploaded PDF documents
export async function getDocuments(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const documents = await prisma.document.findMany({
      where: { userId, type: 'PDF' },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ documents });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// Upload/simulate uploading and parsing a PDF
export async function uploadDocument(req: Request, res: Response) {
  const userId = req.user?.id;
  const { name, fileSize, textContent } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!name || !textContent) {
    return res.status(400).json({ error: 'Validation Error', message: 'Name and document content are required' });
  }

  try {
    const document = await prisma.document.create({
      data: {
        userId,
        name,
        fileUrl: `/uploads/${name.replace(/\s+/g, '_')}`,
        type: 'PDF',
        content: textContent
      }
    });

    // Create a default chat thread for this document
    const chat = await prisma.chat.create({
      data: {
        userId,
        title: `[RAG:${document.id}] Chat with ${name}`
      }
    });

    return res.status(201).json({ document, chatId: chat.id });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// Get chats associated with PDF RAG
export async function getPdfChats(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
        title: { startsWith: '[RAG:' }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return res.status(200).json({ chats });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// Get Chat history details
export async function getChatDetails(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: { id, userId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Not Found', message: 'Chat session not found' });
    }

    // Extract document ID from title: "[RAG:uuid] Chat with name"
    const docIdMatch = chat.title.match(/\[RAG:(.*?)\]/);
    let document = null;
    if (docIdMatch && docIdMatch[1]) {
      document = await prisma.document.findUnique({
        where: { id: docIdMatch[1] }
      });
    }

    return res.status(200).json({ chat: { ...chat, document } });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// Send chat message + Local RAG keyword lookup & credit deduction (1 credit)
export async function sendChatMessage(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params; // ChatId
  const { message } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    const chat = await prisma.chat.findFirst({
      where: { id, userId }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Not Found', message: 'RAG chat session not found' });
    }

    // Find linked document
    const docIdMatch = chat.title.match(/\[RAG:(.*?)\]/);
    let document = null;
    if (docIdMatch && docIdMatch[1]) {
      document = await prisma.document.findUnique({
        where: { id: docIdMatch[1] }
      });
    }

    if (!document) {
      return res.status(404).json({ error: 'Not Found', message: 'Document associated with this chat was not found' });
    }

    // Check credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 1) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (1 credit required)' });
    }

    // Local RAG algorithm: scan document.content paragraphs for keywords matching the message
    const paragraphs = (document.content || '').split(/\n+/).map(p => p.trim()).filter(Boolean);
    const keywords = message.toLowerCase().split(/\W+/).filter((w: string) => w.length > 3);
    
    let matchedParagraphs: string[] = [];
    paragraphs.forEach(p => {
      let score = 0;
      keywords.forEach((word: string) => {
        if (p.toLowerCase().includes(word)) score++;
      });
      if (score > 0) {
        matchedParagraphs.push(p);
      }
    });

    // Fallback if no matching segment is found
    if (matchedParagraphs.length === 0 && paragraphs.length > 0) {
      matchedParagraphs = [paragraphs[0]]; // fallback to first paragraph
    }

    const citationText = matchedParagraphs.slice(0, 2).join('\n\n');
    
    // Build AI reply text integrating RAG citations
    const replyText = `Based on the uploaded document "${document.name}", here is what I found:

${citationText ? `* "${citationText}"` : 'No matching information found in the document.'}

Is there anything specific in these sections you would like me to explain further?`;

    // Save user message
    await prisma.chatMessage.create({
      data: {
        chatId: id,
        role: 'user',
        content: message
      }
    });

    // Save AI response with citations
    const aiMessage = await prisma.chatMessage.create({
      data: {
        chatId: id,
        role: 'assistant',
        content: replyText,
        citations: matchedParagraphs.slice(0, 3) as any
      }
    });

    // Update chat timestamp
    await prisma.chat.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    // Deduct credit
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 1 } }
      });

      await prisma.history.create({
        data: {
          userId,
          module: 'PDF_CHAT',
          action: 'GENERATE',
          creditsUsed: 1
        }
      });
    }

    return res.status(201).json({ reply: aiMessage });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// Delete Document and associated chats
export async function deleteDocument(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const document = await prisma.document.findFirst({
      where: { id, userId }
    });

    if (!document) {
      return res.status(404).json({ error: 'Not Found', message: 'Document not found' });
    }

    await prisma.document.delete({ where: { id } });
    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
