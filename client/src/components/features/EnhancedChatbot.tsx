import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText,
  Loader2,
  Sparkles,
  Target,
  AlertCircle
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: 'funding' | 'market' | 'strategy' | 'general';
  suggestions?: string[];
}

// Enhanced AI responses with current market knowledge
const AI_RESPONSES = {
  funding: {
    keywords: ['funding', 'investment', 'investor', 'capital', 'money', 'raise', 'series', 'seed', 'angel', 'vc'],
    responses: [
      {
        trigger: ['how to raise funding', 'raise money', 'get investment'],
        response: "Based on current market conditions (2024-2025), here's a strategic approach to raising funding:\n\n🎯 **Current Market Reality:**\n• Funding timelines are 3-6 months longer\n• Investors focus heavily on unit economics and profitability\n• Average deal sizes have decreased by 20-30%\n\n📋 **Step-by-Step Process:**\n1. **Prepare Strong Fundamentals** (2-3 months)\n   - Achieve positive unit economics\n   - Build 6+ months runway\n   - Document clear path to profitability\n\n2. **Build Investor Pipeline** (3-4 months)\n   - Research 50+ relevant investors\n   - Secure warm introductions (5-10x higher success rate)\n   - Prepare sector-specific pitch materials\n\n3. **Fundraising Execution** (4-6 months)\n   - Start with smaller checks to build momentum\n   - Maintain regular investor updates\n   - Be prepared for extensive due diligence\n\n💡 **Pro Tips for 2024:**\n• Consider revenue-based financing as alternative\n• Focus on Indian investors who understand local market\n• Highlight AI/technology differentiation\n• Show strong customer retention metrics",
        suggestions: ["What documents do I need?", "How to find the right investors?", "What's a good valuation?", "Alternative funding options"]
      },
      {
        trigger: ['valuation', 'how much equity', 'dilution'],
        response: "💰 **Startup Valuations in 2024 - Realistic Expectations:**\n\n📊 **Current Market Benchmarks:**\n• **Seed Stage:** ₹5-25 Cr ($0.6-3M) - 15-25% equity\n• **Series A:** ₹25-100 Cr ($3-12M) - 20-30% equity  \n• **Series B:** ₹100-400 Cr ($12-50M) - 15-25% equity\n\n⚠️ **2024 Reality Check:**\n• Valuations down 40-60% from 2021 peaks\n• Investors prioritize revenue multiples over growth\n• Down-rounds are common (30% of deals)\n\n🎯 **Valuation Factors:**\n1. **Revenue Multiple:** 5-15x ARR (SaaS), 2-5x (others)\n2. **Growth Rate:** >100% YoY for early stage\n3. **Market Size:** TAM >$1B preferred\n4. **Team Quality:** Proven track record adds 20-30% premium\n5. **Competitive Moat:** Defensible technology/network effects\n\n💡 **Negotiation Strategy:**\n• Focus on investor value-add over valuation\n• Consider liquidation preferences carefully\n• Negotiate anti-dilution protection\n• Secure board seat if taking >20% dilution",
        suggestions: ["How to calculate valuation?", "What's fair equity for employees?", "Investor term sheet basics", "How to negotiate better terms?"]
      }
    ]
  },
  market: {
    keywords: ['market', 'competition', 'industry', 'sector', 'trends', 'opportunity'],
    responses: [
      {
        trigger: ['market size', 'tam', 'market opportunity'],
        response: "📈 **Indian Startup Market Analysis (2024-2025):**\n\n🇮🇳 **Overall Ecosystem:**\n• Total Market: $400B+ digital economy\n• Startup Funding: $11.3B in 2024 (vs $25B in 2021)\n• Active Startups: 100,000+ registered\n• Unicorns: 108 (8 new in 2024)\n\n🔥 **Hottest Sectors:**\n1. **FinTech** - $31B market, 22% CAGR\n   - Embedded finance, AI credit scoring\n   - Rural fintech penetration opportunity\n\n2. **SaaS/Enterprise** - $13.2B market, 35% CAGR\n   - AI-first products, vertical SaaS\n   - Global expansion from India\n\n3. **HealthTech** - $9.8B market, 28% CAGR\n   - Telemedicine, AI diagnostics\n   - Rural healthcare access\n\n4. **Consumer/D2C** - $45B market, 18% CAGR\n   - Quick commerce, social commerce\n   - Tier 2/3 city penetration\n\n💡 **Market Entry Strategy:**\n• Start with specific niche/vertical\n• Focus on underserved segments\n• Build for India, scale globally\n• Leverage mobile-first approach",
        suggestions: ["Which sector should I choose?", "How to validate market demand?", "Competitive analysis tips", "Go-to-market strategy"]
      }
    ]
  },
  strategy: {
    keywords: ['strategy', 'business model', 'growth', 'scale', 'plan', 'roadmap'],
    responses: [
      {
        trigger: ['business model', 'monetization', 'revenue model'],
        response: "💼 **Proven Business Models for Indian Startups (2024):**\n\n🎯 **High-Success Models:**\n\n1. **SaaS Subscription** (35% success rate)\n   - Monthly/Annual recurring revenue\n   - Freemium → Premium conversion\n   - Usage-based pricing for scale\n\n2. **Marketplace Commission** (25% success rate)\n   - 2-5% transaction fees\n   - Subscription for premium features\n   - Advertising revenue from sellers\n\n3. **Fintech Transaction** (30% success rate)\n   - Payment processing fees (1-3%)\n   - Interest on lending products\n   - Premium financial services\n\n4. **D2C/E-commerce** (20% success rate)\n   - Product margins (30-60%)\n   - Subscription boxes\n   - Private label manufacturing\n\n📊 **Revenue Optimization:**\n• **Unit Economics:** Aim for 3:1 LTV:CAC ratio\n• **Pricing Strategy:** Start premium, expand down-market\n• **Multiple Revenue Streams:** Reduce single-point failure\n• **Recurring Revenue:** Target >70% recurring component\n\n⚡ **Growth Levers:**\n• Viral/referral mechanisms (K-factor >1.0)\n• Network effects and data moats\n• Geographic expansion strategy\n• Product-led growth (PLG) adoption",
        suggestions: ["How to price my product?", "Customer acquisition strategies", "Building recurring revenue", "Scaling operations"]
      }
    ]
  }
};

// Quick response suggestions based on common founder questions
const QUICK_SUGGESTIONS = [
  "How to raise seed funding in 2024?",
  "What's my startup valuation?", 
  "Best investors for my sector",
  "Current market trends",
  "How to build a pitch deck?",
  "Customer acquisition strategies",
  "When should I raise funding?",
  "How to find co-founders?",
  "Legal structure for startups",
  "Tax benefits for startups"
];

export default function EnhancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "👋 Hi! I'm your AI funding advisor with real-time knowledge of the Indian startup ecosystem (2024-2025). I can help you with:\n\n🎯 **Funding Strategy & Investor Matching**\n📊 **Market Analysis & Trends** \n💼 **Business Model & Growth Strategy**\n📋 **Pitch Deck & Documentation**\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      category: 'general',
      suggestions: ["Funding strategy", "Market analysis", "Business planning", "Investor research"]
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check each category for keyword matches
    for (const [category, data] of Object.entries(AI_RESPONSES)) {
      const hasKeyword = data.keywords.some(keyword => lowerMessage.includes(keyword));
      
      if (hasKeyword) {
        // Find specific response based on triggers
        for (const responseData of data.responses) {
          const matchesTrigger = responseData.trigger.some(trigger => 
            lowerMessage.includes(trigger.toLowerCase())
          );
          
          if (matchesTrigger) {
            return {
              id: Date.now().toString(),
              type: 'bot',
              content: responseData.response,
              timestamp: new Date(),
              category: category as any,
              suggestions: responseData.suggestions
            };
          }
        }
        
        // Default category response if no specific trigger matches
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: getDefaultCategoryResponse(category, lowerMessage),
          timestamp: new Date(),
          category: category as any,
          suggestions: getDefaultSuggestions(category)
        };
      }
    }
    
    // General AI response for unmatched queries
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: getGeneralResponse(lowerMessage),
      timestamp: new Date(),
      category: 'general',
      suggestions: ["Tell me more", "Show examples", "What's next?", "Related topics"]
    };
  };

  const getDefaultCategoryResponse = (category: string, message: string): string => {
    switch (category) {
      case 'funding':
        return "💰 I can help you with funding strategies! The current market (2024-2025) requires a different approach than previous years. Investors are more cautious and focus heavily on:\n\n• **Unit Economics** - Clear path to profitability\n• **Market Validation** - Proven customer demand\n• **Team Strength** - Experienced founders\n• **Realistic Valuations** - 40-60% lower than 2021 peaks\n\nWhat specific aspect of funding would you like to explore?";
      
      case 'market':
        return "📊 Great question about market dynamics! The Indian startup ecosystem in 2024 shows interesting patterns:\n\n• **Total Funding:** $11.3B (down from $25B peak)\n• **Hot Sectors:** AI/ML, FinTech, HealthTech, SaaS\n• **Geographic Shift:** Tier 2/3 cities gaining traction\n• **Business Models:** Focus on profitability over growth\n\nWhich market aspect interests you most?";
      
      case 'strategy':
        return "🎯 Strategic planning is crucial in today's market! Successful startups in 2024 focus on:\n\n• **Customer-Centric Approach** - Deep user research\n• **Lean Operations** - Efficient capital deployment  \n• **Technology Moats** - AI/ML differentiation\n• **Sustainable Growth** - Quality over quantity metrics\n\nWhat strategic challenge can I help you solve?";
      
      default:
        return "🤔 I understand you're asking about startup-related topics. I have extensive knowledge about the current Indian startup ecosystem, funding landscape, and growth strategies. Could you be more specific about what you'd like to know?";
    }
  };

  const getDefaultSuggestions = (category: string): string[] => {
    switch (category) {
      case 'funding':
        return ["Investor research", "Pitch deck tips", "Valuation guidance", "Term sheet help"];
      case 'market':
        return ["Sector analysis", "Competition research", "Market sizing", "Trend insights"];
      case 'strategy':
        return ["Business model", "Growth hacking", "Operations", "Team building"];
      default:
        return ["Funding advice", "Market insights", "Strategy help", "General guidance"];
    }
  };

  const getGeneralResponse = (message: string): string => {
    if (message.includes('hello') || message.includes('hi')) {
      return "👋 Hello! I'm here to help you navigate the Indian startup ecosystem with the latest 2024-2025 insights. Whether you need funding advice, market analysis, or strategic guidance, I've got you covered!";
    }
    
    if (message.includes('thank')) {
      return "🙏 You're welcome! I'm always here to help founders succeed. The startup journey is challenging, but with the right guidance and current market knowledge, you can build something amazing!";
    }
    
    return "🤖 I'm your AI advisor specializing in Indian startup ecosystem insights. I can provide current data, strategic advice, and actionable recommendations based on 2024-2025 market conditions. What specific challenge are you facing?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'funding': return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'market': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'strategy': return <Target className="w-4 h-4 text-purple-600" />;
      default: return <Lightbulb className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <Card className="h-[650px] flex flex-col shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Funding Advisor</h3>
            <p className="text-base text-muted-foreground font-normal">
              Real-time insights • Indian startup ecosystem • 2024-2025 data
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted border-2 border-primary/20'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                    </div>
                    
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted border border-border'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.category && getCategoryIcon(message.category)}
                        <span className="text-xs font-medium capitalize">
                          {message.category || 'General'}
                        </span>
                      </div>
                      
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      
                      {message.suggestions && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <p className="text-xs font-medium mb-2 opacity-70">Suggested questions:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs opacity-50 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-muted border-2 border-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted border border-border rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">AI is analyzing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs font-medium mb-2 text-muted-foreground">Quick questions:</p>
          <div className="flex flex-wrap gap-1">
            {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about funding, market trends, strategy..."
              disabled={isTyping}
              className="flex-1"
            />
            <Button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()}
              size="icon"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}