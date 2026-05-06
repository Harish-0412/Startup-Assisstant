import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Database, Loader2 } from 'lucide-react';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  model?: string;
  chunksRetrieved?: number;
  sources?: string[];
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen]       = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbCount, setDbCount]     = useState<number | null>(null);
  const [messages, setMessages]   = useState<ChatMessage[]>([{
    id: '1',
    text: "Hi! I'm your AI assistant powered by Groq + RAG. I can answer questions from your scraped websites and uploaded PDFs. Ask me anything!",
    isUser: false,
    timestamp: new Date(),
  }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check DB health on open
  useEffect(() => {
    if (!isOpen) return;
    fetch(`${API_BASE_URL}/rag/health`)
      .then(r => r.json())
      .then(d => setDbCount(d.vector_records ?? 0))
      .catch(() => setDbCount(null));
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const question = inputText.trim();
    setInputText('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, use_context: true }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.detail || `HTTP ${resp.status}`);
      }

      const data = await resp.json();
      const uniqueSources = [...new Set(
        (data.sources || []).map((s: any) => s.source_file).filter(Boolean)
      )].slice(0, 3) as string[];

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        timestamp: new Date(),
        model: data.model,
        chunksRetrieved: data.chunks_retrieved,
        sources: uniqueSources,
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${err.message}. Make sure the backend is running at ${API_BASE_URL}.`,
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickQuestions = [
    "What is Intuit Mint?",
    "Explain startup funding stages",
    "What are the key topics in my documents?",
    "How do I raise seed funding?",
  ];

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(o => !o)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[520px] bg-white rounded-xl shadow-2xl border z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <p className="font-semibold text-sm">RAG AI Assistant</p>
                <p className="text-xs opacity-80">Groq · llama-3.3-70b</p>
              </div>
            </div>
            {dbCount !== null && (
              <div className="flex items-center gap-1 text-xs bg-white/20 rounded-full px-2 py-0.5">
                <Database size={10} />
                <span>{dbCount} chunks</span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm shadow-sm ${
                  msg.isUser
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {!msg.isUser && (msg.chunksRetrieved || msg.sources?.length) ? (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100 space-y-0.5">
                      {msg.chunksRetrieved ? (
                        <p className="text-xs text-green-600">{msg.chunksRetrieved} chunks retrieved</p>
                      ) : null}
                      {msg.sources?.length ? (
                        <p className="text-xs text-gray-400 truncate">
                          Sources: {msg.sources.join(', ')}
                        </p>
                      ) : null}
                      {msg.model && (
                        <p className="text-xs text-gray-400">{msg.model}</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-xl rounded-bl-none px-3 py-2 shadow-sm">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Loader2 size={14} className="animate-spin" />
                    <span className="text-xs">Searching knowledge base...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions (only on first message) */}
          {messages.length === 1 && (
            <div className="px-3 py-2 bg-white border-t flex flex-wrap gap-1">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(q)}
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full px-2 py-1 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything from your knowledge base..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
