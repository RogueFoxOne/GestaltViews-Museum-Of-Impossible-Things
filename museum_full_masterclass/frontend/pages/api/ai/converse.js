/**
 * Example Next.js API route that uses Prisma Client to store/retrieve conversation data.
 * Place in frontend/pages/api/ai/converse.js (Pages Router) or adapt to app router handlers.
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { userId, content, role = 'user', conversationId } = req.body;

      let convId = conversationId;
      if (!convId) {
        const conv = await prisma.conversation.create({
          data: { userId, title: 'New Conversation' }
        });
        convId = conv.id;
      }

      const message = await prisma.message.create({
        data: {
          conversationId: convId,
          role,
          content
        }
      });

      // Placeholder: call your LLM here (server-side) and return assistant reply
      const assistantReply = { role: 'assistant', content: 'This is a placeholder reply.' };

      // Save assistant message
      await prisma.message.create({
        data: {
          conversationId: convId,
          role: assistantReply.role,
          content: assistantReply.content
        }
      });

      return res.status(200).json({ conversationId: convId, assistant: assistantReply });
    } else if (req.method === 'GET') {
      const { conversationId } = req.query;
      if (!conversationId) return res.status(400).json({ error: 'conversationId required' });
      const messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
      });
      return res.status(200).json({ messages });
    }
    res.setHeader('Allow', ['GET','POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
}
