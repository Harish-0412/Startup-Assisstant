import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { RAGService } from "./rag-service";
import { documents, chatSessions, chatMessages, ingestionLogs } from "../shared/schema";
import { eq } from "drizzle-orm";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

const ragService = new RAGService();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // RAG Chat endpoints
  app.post('/api/chat/ask', async (req, res) => {
    try {
      const { question, sessionId, type = 'general' } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      // Get or create chat session
      let session;
      if (sessionId) {
        session = await storage.db.select().from(chatSessions).where(eq(chatSessions.id, sessionId)).limit(1);
        session = session[0];
      }
      
      if (!session) {
        const newSession = await storage.db.insert(chatSessions).values({
          title: question.substring(0, 50) + '...',
          userId: req.user?.id || null,
        }).returning();
        session = newSession[0];
      }

      // Save user message
      await storage.db.insert(chatMessages).values({
        sessionId: session.id,
        role: 'user',
        content: question,
      });

      // Get RAG response
      let response;
      if (type === 'funding') {
        response = await ragService.askFundingQuestion(question);
      } else {
        response = await ragService.askQuestion(question);
      }

      // Save assistant message
      await storage.db.insert(chatMessages).values({
        sessionId: session.id,
        role: 'assistant',
        content: response.answer,
        metadata: {
          references: response.references,
          language: response.language,
          status: response.status,
        },
      });

      res.json({
        sessionId: session.id,
        answer: response.answer,
        references: response.references,
        language: response.language,
        status: response.status,
      });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to process question' });
    }
  });

  // Get chat sessions
  app.get('/api/chat/sessions', async (req, res) => {
    try {
      const sessions = await storage.db.select().from(chatSessions)
        .where(eq(chatSessions.userId, req.user?.id || ''))
        .orderBy(chatSessions.updatedAt);
      
      res.json(sessions);
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: 'Failed to get chat sessions' });
    }
  });

  // Get chat messages for a session
  app.get('/api/chat/sessions/:sessionId/messages', async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const messages = await storage.db.select().from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionId))
        .orderBy(chatMessages.createdAt);
      
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to get chat messages' });
    }
  });

  // Document ingestion endpoints
  app.post('/api/documents/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      const file = req.file;
      const originalName = file.originalname;
      const filename = file.filename;
      
      // Save document record
      const document = await storage.db.insert(documents).values({
        filename,
        originalName,
        type: 'pdf',
        filePath: file.path,
        status: 'processing',
        userId: req.user?.id || null,
      }).returning();

      // Move file to RAG data directory
      const ragDataPath = path.join(process.cwd(), 'ai-verse', 'Data Ingestion', 'data', 'raw', filename + '.pdf');
      await fs.copyFile(file.path, ragDataPath);
      await fs.unlink(file.path); // Clean up temp file

      // Process PDF with RAG service
      try {
        const result = await ragService.ingestPDF(ragDataPath);
        
        // Update document status
        await storage.db.update(documents)
          .set({
            status: result.success ? 'completed' : 'failed',
            chunks: result.chunks,
            language: result.language,
            updatedAt: new Date(),
          })
          .where(eq(documents.id, document[0].id));

        // Log ingestion
        await storage.db.insert(ingestionLogs).values({
          userId: req.user?.id || null,
          documentId: document[0].id,
          action: 'pdf_upload',
          status: result.success ? 'success' : 'failed',
          message: result.message,
          details: result,
        });

        res.json({
          documentId: document[0].id,
          success: result.success,
          message: result.message,
          chunks: result.chunks,
          language: result.language,
        });
      } catch (error) {
        // Update document status to failed
        await storage.db.update(documents)
          .set({ status: 'failed', updatedAt: new Date() })
          .where(eq(documents.id, document[0].id));

        throw error;
      }
    } catch (error) {
      console.error('PDF upload error:', error);
      res.status(500).json({ error: 'Failed to process PDF' });
    }
  });

  app.post('/api/documents/ingest-website', async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Save document record
      const document = await storage.db.insert(documents).values({
        filename: new URL(url).hostname,
        originalName: url,
        type: 'website',
        url,
        status: 'processing',
        userId: req.user?.id || null,
      }).returning();

      // Process website with RAG service
      try {
        const result = await ragService.ingestWebsite(url);
        
        // Update document status
        await storage.db.update(documents)
          .set({
            status: result.success ? 'completed' : 'failed',
            chunks: result.chunks,
            language: result.language,
            updatedAt: new Date(),
          })
          .where(eq(documents.id, document[0].id));

        // Log ingestion
        await storage.db.insert(ingestionLogs).values({
          userId: req.user?.id || null,
          documentId: document[0].id,
          action: 'website_scrape',
          status: result.success ? 'success' : 'failed',
          message: result.message,
          details: result,
        });

        res.json({
          documentId: document[0].id,
          success: result.success,
          message: result.message,
          chunks: result.chunks,
          language: result.language,
        });
      } catch (error) {
        // Update document status to failed
        await storage.db.update(documents)
          .set({ status: 'failed', updatedAt: new Date() })
          .where(eq(documents.id, document[0].id));

        throw error;
      }
    } catch (error) {
      console.error('Website ingestion error:', error);
      res.status(500).json({ error: 'Failed to process website' });
    }
  });

  // Vector database management
  app.post('/api/vector-db/build', async (req, res) => {
    try {
      const result = await ragService.buildVectorDatabase();
      
      // Log the build operation
      await storage.db.insert(ingestionLogs).values({
        userId: req.user?.id || null,
        documentId: null,
        action: 'vector_build',
        status: result.success ? 'success' : 'failed',
        message: result.message,
        details: result,
      });

      res.json(result);
    } catch (error) {
      console.error('Vector DB build error:', error);
      res.status(500).json({ error: 'Failed to build vector database' });
    }
  });

  // Search documents
  app.post('/api/search', async (req, res) => {
    try {
      const { query, topK = 5 } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: 'Query is required' });
      }

      const result = await ragService.searchDocuments(query, topK);
      res.json(result);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to search documents' });
    }
  });

  // Get documents
  app.get('/api/documents', async (req, res) => {
    try {
      const docs = await storage.db.select().from(documents)
        .where(eq(documents.userId, req.user?.id || ''))
        .orderBy(documents.createdAt);
      
      res.json(docs);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: 'Failed to get documents' });
    }
  });

  // Get ingestion logs
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.db.select().from(ingestionLogs)
        .where(eq(ingestionLogs.userId, req.user?.id || ''))
        .orderBy(ingestionLogs.createdAt);
      
      res.json(logs);
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ error: 'Failed to get logs' });
    }
  });

  return httpServer;
}
