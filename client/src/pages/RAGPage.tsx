import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useLocation } from 'wouter';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, FileText, Globe, Database, Zap, Upload, MessageCircle, BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import Carousel from '../components/Carousel';

export default function RAGPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chatInput, setChatInput] = useState('');
  const [, setLocation] = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [websites, setWebsites] = useState<string[]>(['']);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [scrapedData, setScrapedData] = useState<any[]>([]);
  const [vectorDbSummary, setVectorDbSummary] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, type: 'bot', content: 'Welcome to StartupHub RAG System! I can help you with funding, market insights, and document analysis. Upload documents or add websites to get started.' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addWebsiteField = () => setWebsites(prev => [...prev, '']);
  const updateWebsite = (index: number, value: string) => setWebsites(prev => prev.map((w, i) => i === index ? value : w));
  const removeWebsite = (index: number) => { if (websites.length > 1) setWebsites(prev => prev.filter((_, i) => i !== index)); };

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const pdfs = Array.from(incoming).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfs.length === 0) { alert('Only PDF files are supported.'); return; }
    const newFiles = pdfs.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      summary: null,
      processed: false,
    }));
    setUploadedFiles(prev => {
      const existingNames = new Set(prev.map(f => f.name));
      return [...prev, ...newFiles.filter(f => !existingNames.has(f.name))];
    });
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: number) => setUploadedFiles(prev => prev.filter(f => f.id !== id));

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const scrapeWebsites = async () => {
    const validUrls = websites.filter(url => url.trim() && url.startsWith('http'));
    if (validUrls.length === 0) { alert('Please add at least one valid URL starting with http/https'); return; }

    setIsProcessing(true);
    setProcessingProgress(10);

    try {
      const response = await fetch(`${API_BASE_URL}/rag/scrape-websites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls }),
      });
      setProcessingProgress(60);

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || err?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setProcessingProgress(70);

      if (data.success) {
        setScrapedData(data.scraped_data.filter((item: any) => item.processed));
        // Auto-build vector DB after scraping
        await buildVectorDatabaseInternal();
      } else {
        throw new Error(data.message || 'Scraping failed');
      }
    } catch (error: any) {
      console.error('Scrape error:', error);
      alert(`Scraping failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const uploadAndProcessDocuments = async () => {
    const pending = uploadedFiles.filter(f => !f.processed && f.file);
    if (pending.length === 0) { alert('No new PDF files to upload.'); return; }

    setIsProcessing(true);
    setProcessingProgress(10);

    try {
      const formData = new FormData();
      pending.forEach(f => formData.append('files', f.file));

      const response = await fetch(`${API_BASE_URL}/rag/upload-pdf`, { method: 'POST', body: formData });
      setProcessingProgress(55);

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || err?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setProcessingProgress(70);

      if (data.success) {
        setUploadedFiles(prev => prev.map(file => {
          const pf = data.processed_files?.find((p: any) => p.name === file.name);
          return pf ? { ...file, summary: pf.summary, keyTopics: pf.key_topics,
            pageCount: pf.page_count, wordCount: pf.word_count, processed: pf.processed } : file;
        }));
        // Auto-build vector DB after successful upload
        await buildVectorDatabaseInternal();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Internal build — can be called after upload/scrape without resetting isProcessing
  const buildVectorDatabaseInternal = async () => {
    setProcessingProgress(80);
    try {
      const response = await fetch(`${API_BASE_URL}/rag/build-vector-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rebuild: false }),
      });
      setProcessingProgress(95);
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || err?.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success) setVectorDbSummary(data.summary);
      setProcessingProgress(100);
    } catch (error: any) {
      console.error('Vector DB build error:', error);
      // Don't alert here — upload already succeeded
    }
  };

  const buildVectorDatabase = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    try {
      setProcessingProgress(30);
      const response = await fetch(`${API_BASE_URL}/rag/build-vector-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rebuild: vectorDbSummary !== null }),
      });
      setProcessingProgress(80);
      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || err?.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      setProcessingProgress(100);
      if (data.success) setVectorDbSummary(data.summary);
      else throw new Error(data.message || 'Build failed');
    } catch (error: any) {
      console.error('Vector DB error:', error);
      alert(`Vector DB build failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput('');

    const userMessage = { id: Date.now(), type: 'user', content: userMsg };
    setMessages(prev => [...prev, userMessage]);

    const loadingId = Date.now() + 1;
    setMessages(prev => [...prev, { id: loadingId, type: 'bot', content: '...', loading: true }]);

    try {
      const response = await fetch(`${API_BASE_URL}/rag/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, use_context: true }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const modelLabel = data.model && data.model !== 'context-only' && data.model !== 'none'
        ? ` · ${data.model}`
        : data.model === 'context-only' ? ' · context-only (add LLM key for AI answers)' : '';

      const sourcesText = data.sources?.length
        ? `\n\n**Sources:** ${[...new Set(data.sources.map((s: any) => s.source_file))].slice(0, 3).join(', ')}`
        : '';

      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, content: data.answer + sourcesText, loading: false, model: modelLabel,
              contextUsed: data.context_used, chunksRetrieved: data.chunks_retrieved }
          : m
      ));
    } catch (error: any) {
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? { ...m, content: `Error: ${error.message}`, loading: false }
          : m
      ));
    }
  };

  const getEnhancedBotResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    const hasVectorDb = vectorDbSummary !== null;
    const hasDocuments = uploadedFiles.length > 0 || scrapedData.length > 0;
    
    if (!hasVectorDb && hasDocuments) {
      return `⚠️ **Vector Database Not Built Yet**

I can see you have uploaded ${uploadedFiles.length} documents and scraped ${scrapedData.length} websites, but the vector database hasn't been built yet.

**To get accurate answers:**
1. Go to the Upload tab
2. Click "Build Vector Database"
3. Wait for processing to complete
4. Then ask your questions here

Once built, I'll be able to search through your specific documents and provide precise answers based on your content.`;
    }
    
    if (!hasDocuments) {
      return `📚 **No Documents Available**

To get the most accurate answers, please:
1. Upload PDF documents in the Upload tab
2. Add website URLs to scrape
3. Build the vector database
4. Then ask questions about your content

**I can still help with general queries about:**
• Funding strategies and market trends
• Investor information and networking
• Business planning and strategy
• Government schemes and policies`;
    }
    
    // Enhanced responses with document context
    if (lowerInput.includes('funding') || lowerInput.includes('investor')) {
      return `🎯 **Funding Analysis (Based on Your Documents)**

**From Your Uploaded Content:**
${hasVectorDb ? `• Analyzed ${vectorDbSummary.totalDocuments} documents with ${vectorDbSummary.totalChunks} data chunks
• Key funding topics identified: ${vectorDbSummary.keyTopics.slice(0, 4).join(', ')}
• Content relevance score: ${vectorDbSummary.avgRelevance}/1.0` : '• Processing your documents...'}

**Current Market Reality (2024-2025):**
• Funding timelines: 8-12 months (vs 3-6 months in 2021)
• Valuations down 40-60% from peak
• Focus on profitability over growth

**Recommended Next Steps:**
• Review your pitch deck against current market expectations
• Identify investors aligned with your sector
• Prepare for extended due diligence processes`;
    }
    
    if (lowerInput.includes('document') || lowerInput.includes('content')) {
      return `📄 **Your Document Analysis**

**Processed Content:**
• Documents: ${uploadedFiles.length} PDFs uploaded
• Websites: ${scrapedData.length} sites scraped
• Total words: ${hasVectorDb ? vectorDbSummary.totalWords.toLocaleString() : 'Processing...'}
• Key topics: ${hasVectorDb ? vectorDbSummary.keyTopics.join(', ') : 'Analyzing...'}

**Document Summaries:**
${uploadedFiles.slice(0, 2).map(file => `• ${file.name}: ${file.summary || 'Processing...'}`).join('\n')}
${scrapedData.slice(0, 2).map(site => `• ${site.title}: ${site.summary}`).join('\n')}

**Ask specific questions about your content for detailed insights!**`;
    }
    
    return `🤖 **RAG Assistant Ready**

**Your Knowledge Base:**
• ${uploadedFiles.length} documents processed
• ${scrapedData.length} websites analyzed
• ${hasVectorDb ? `${vectorDbSummary.totalChunks} searchable chunks` : 'Building vector database...'}

**I can help you with:**
• Specific questions about your uploaded documents
• Analysis of your business plans or pitch decks
• Funding strategies based on your content
• Market insights relevant to your business

**Try asking:** "What are the key points in my business plan?" or "How can I improve my funding strategy?"`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Bot className="h-8 w-8 text-blue-600" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StartupHub RAG Intelligence System
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Database className="h-8 w-8 text-purple-600" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Retrieval-Augmented Generation with Current Market Data (2024-2025)
          </p>
        </motion.div>
        
        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: FileText, title: 'Data Ingestion', desc: 'PDF & Website Processing', color: 'blue' },
            { icon: Database, title: 'Vector Search', desc: 'Semantic Document Search', color: 'green' },
            { icon: MessageCircle, title: 'RAG Chat', desc: 'AI-Powered Q&A', color: 'purple' },
            { icon: Zap, title: 'Groq LLM', desc: 'Fast AI Responses', color: 'orange' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="transition-all duration-300"
            >
              <Card className={`border-${feature.color}-200 bg-${feature.color}-50/50 hover:shadow-lg`}>
                <CardContent className="p-4 text-center">
                  <feature.icon className={`h-8 w-8 mx-auto mb-2 text-${feature.color}-600`} />
                  <h3 className={`font-semibold text-${feature.color}-900`}>{feature.title}</h3>
                  <p className={`text-sm text-${feature.color}-700`}>{feature.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              RAG Chat
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* StartupHub Features Carousel */}
                <div className="lg:col-span-2">
                  <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        StartupHub RAG Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex justify-center">
                      <div style={{ height: '400px', position: 'relative' }}>
                        <Carousel
                          baseWidth={350}
                          autoplay={true}
                          autoplayDelay={4000}
                          pauseOnHover={true}
                          loop={true}
                          round={false}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Market Stats */}
                <div className="lg:col-span-1">
                  <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Market Stats (2024)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: '$11.3B', label: 'Total Funding', color: 'green' },
                            { value: '108', label: 'Unicorns', color: 'blue' },
                            { value: '8-12', label: 'Months Timeline', color: 'purple' },
                            { value: '1200+', label: 'Total Deals', color: 'orange' }
                          ].map((stat, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 + idx * 0.1, duration: 0.3 }}
                              whileHover={{ scale: 1.05 }}
                              className={`text-center p-3 bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-lg border border-${stat.color}-200`}
                            >
                              <p className={`text-xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                              <p className={`text-xs text-${stat.color}-700`}>{stat.label}</p>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="pt-2 border-t">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-xs"
                            onClick={() => setLocation('/market-analysis')}
                          >
                            View Detailed Analytics
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Access Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {[
                  { icon: Users, title: 'Local Investors', desc: 'Find investors in your city', path: '/local-investors', color: 'blue' },
                  { icon: FileText, title: 'Funding Policies', desc: 'Government schemes & policies', path: '/funding-policies', color: 'green' },
                  { icon: BarChart3, title: 'Market Analysis', desc: 'Sector-wise insights', path: '/market-analysis', color: 'purple' },
                  { icon: Target, title: 'Action Plans', desc: 'Personalized roadmaps', path: '/action-plans', color: 'orange' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="cursor-pointer"
                    onClick={() => setLocation(item.path)}
                  >
                    <Card className={`hover:shadow-lg transition-all duration-300 border-${item.color}-200 hover:border-${item.color}-400`}>
                      <CardContent className="p-4 text-center">
                        <item.icon className={`h-8 w-8 mx-auto mb-2 text-${item.color}-600`} />
                        <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                        <Button size="sm" variant="outline" className="text-xs">
                          {item.title === 'Local Investors' ? 'Explore' : item.title === 'Funding Policies' ? 'View Policies' : item.title === 'Market Analysis' ? 'Analyze' : 'Get Plan'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          {/* Knowledge Base Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">📄</div>
                <h3 className="font-semibold text-blue-900">{uploadedFiles.length} Documents</h3>
                <p className="text-sm text-blue-700">
                  {uploadedFiles.filter(f => f.processed).length} processed
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🌐</div>
                <h3 className="font-semibold text-green-900">{scrapedData.length} Websites</h3>
                <p className="text-sm text-green-700">
                  {scrapedData.reduce((acc, site) => acc + site.wordCount, 0).toLocaleString()} words
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="font-semibold text-purple-900">Vector DB</h3>
                <p className="text-sm text-purple-700">
                  {vectorDbSummary ? `${vectorDbSummary.totalChunks} chunks` : 'Not built'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  💬 RAG Assistant
                  <Badge variant="secondary">Powered by Groq</Badge>
                </div>
                <div className="flex gap-2">
                  {vectorDbSummary && (
                    <Badge variant="default">DB Ready</Badge>
                  )}
                  {(uploadedFiles.length > 0 || scrapedData.length > 0) && (
                    <Badge variant="outline">
                      {uploadedFiles.length + scrapedData.length} sources
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {message.loading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                          Searching knowledge base...
                        </div>
                      ) : (
                        <>
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                          {message.model && (
                            <p className="text-xs text-muted-foreground mt-1 opacity-60">{message.model}</p>
                          )}
                          {message.contextUsed && message.chunksRetrieved > 0 && (
                            <p className="text-xs text-green-600 mt-1">{message.chunksRetrieved} chunks retrieved from knowledge base</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t space-y-3">
                {/* Quick Questions */}
                {messages.length <= 1 && (
                  <div className="flex flex-wrap gap-2">
                    {[
                      "What's in my documents?",
                      "Analyze my business plan",
                      "Funding strategy advice",
                      "Market analysis"
                    ].map((question, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => setChatInput(question)}
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={vectorDbSummary ? "Ask about your documents..." : "Upload documents first, then ask questions..."}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PDF Upload Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> PDF Upload</span>
                  <Badge variant="outline">{uploadedFiles.length} files</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={handleFileInputChange}
                />

                {/* Drag-and-drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none
                    ${ isDragging
                      ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/40'
                    }`}
                >
                  <Upload className={`h-10 w-10 mx-auto mb-3 transition-colors ${ isDragging ? 'text-blue-500' : 'text-gray-400' }`} />
                  <p className="font-semibold text-sm mb-1">
                    {isDragging ? 'Drop PDFs here' : 'Drag & drop PDFs here'}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">or click to browse files</p>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium pointer-events-none">
                    <Upload className="h-3.5 w-3.5" /> Choose Files
                  </span>
                  <p className="text-xs text-muted-foreground mt-3">Supports: PDF • Business plans, pitch decks, reports</p>
                </div>

                {/* File list */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">Files ({uploadedFiles.length})</h4>
                      <button onClick={() => setUploadedFiles([])} className="text-xs text-red-500 hover:underline">Clear all</button>
                    </div>
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                      {uploadedFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 border rounded-lg bg-white"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-red-500 shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant={file.processed ? 'default' : 'secondary'} className="text-xs">
                                {file.processed ? 'Processed' : 'Pending'}
                              </Badge>
                              {!file.processed && (
                                <button onClick={() => removeFile(file.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                              )}
                            </div>
                          </div>
                          {file.processed && file.summary && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{file.summary}</p>
                          )}
                          {file.processed && file.keyTopics && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {file.keyTopics.map((t: any, i: number) => <Badge key={i} variant="outline" className="text-xs">{t}</Badge>)}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <Button
                      onClick={uploadAndProcessDocuments}
                      disabled={isProcessing || uploadedFiles.every(f => f.processed)}
                      className="w-full"
                    >
                      {isProcessing
                        ? <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Processing & Building DB...</span>
                        : <span className="flex items-center gap-2"><Upload className="h-4 w-4" /> Upload & Process PDFs</span>
                      }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  🌐 Website Scraping
                  <Badge variant="outline">{scrapedData.length} sites</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {websites.map((website, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://example.com"
                        value={website}
                        onChange={(e) => updateWebsite(index, e.target.value)}
                        className="flex-1"
                      />
                      {websites.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeWebsite(index)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={addWebsiteField} className="flex-1">
                      + Add Website
                    </Button>
                    <Button onClick={scrapeWebsites} disabled={isProcessing} className="flex-1">
                      {isProcessing ? "Scraping..." : "Scrape Websites"}
                    </Button>
                  </div>
                </div>
                
                {scrapedData.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <h4 className="font-medium text-sm">Scraped Websites:</h4>
                    {scrapedData.map((site) => (
                      <div key={site.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{site.title}</span>
                          <Badge variant="default">Score: {site.relevanceScore}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{site.summary}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{site.wordCount || 0} words</span>
                          <span>{Array.isArray(site.keyTopics) ? site.keyTopics.join(', ') : 'N/A'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Processing...</span>
                  <span className="text-sm">{processingProgress.toFixed(0)}%</span>
                </div>
                <Progress value={processingProgress} className="w-full" />
              </CardContent>
            </Card>
          )}

          {/* Vector Database Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                🔧 Vector Database
                {vectorDbSummary && <Badge variant="default">Built</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!vectorDbSummary ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Build Vector Database</p>
                    <p className="text-sm text-muted-foreground">
                      Process {uploadedFiles.length + scrapedData.length} items for semantic search
                    </p>
                  </div>
                  <Button 
                    onClick={buildVectorDatabase} 
                    disabled={isProcessing || (uploadedFiles.length === 0 && scrapedData.length === 0)}
                  >
                    {isProcessing ? "Building..." : "Build Database"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{vectorDbSummary.totalDocuments}</p>
                      <p className="text-xs text-blue-700">Documents</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">{vectorDbSummary.totalChunks}</p>
                      <p className="text-xs text-green-700">Chunks</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xl font-bold text-purple-600">{vectorDbSummary.totalWords.toLocaleString()}</p>
                      <p className="text-xs text-purple-700">Words</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-xl font-bold text-orange-600">{vectorDbSummary.avgRelevance}</p>
                      <p className="text-xs text-orange-700">Avg Quality</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">📊 Database Summary</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Built on {vectorDbSummary.buildTime} • Status: {vectorDbSummary.status}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {vectorDbSummary.keyTopics.map((topic: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={buildVectorDatabase} 
                    variant="outline" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Rebuild Database
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🏢 Top Active Investors (2024)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Sequoia Capital India', ticket: '₹5-50 Cr', focus: 'SaaS, FinTech' },
                  { name: 'Accel Partners', ticket: '₹10-100 Cr', focus: 'Enterprise, SaaS' },
                  { name: 'Matrix Partners', ticket: '₹5-75 Cr', focus: 'Early Stage' },
                  { name: 'Blume Ventures', ticket: '₹2-25 Cr', focus: 'Seed, Series A' }
                ].map((investor, i) => (
                  <div key={i} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{investor.name}</p>
                        <p className="text-sm text-muted-foreground">{investor.focus}</p>
                      </div>
                      <Badge variant="outline">{investor.ticket}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Sector Performance (2024)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { sector: 'FinTech', market: '$31B', growth: '22% CAGR', funding: '$2.8B' },
                  { sector: 'SaaS', market: '$13.2B', growth: '35% CAGR', funding: '$1.9B' },
                  { sector: 'HealthTech', market: '$9.8B', growth: '28% CAGR', funding: '$1.2B' },
                  { sector: 'Consumer', market: '$45B', growth: '18% CAGR', funding: '$3.2B' }
                ].map((sector, i) => (
                  <div key={i} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{sector.sector}</p>
                      <Badge>{sector.growth}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <span>Market: {sector.market}</span>
                      <span>Funding: {sector.funding}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}