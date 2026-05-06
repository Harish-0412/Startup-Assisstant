import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, BarChart3, CheckCircle, AlertCircle, TrendingUp, Target, Users, DollarSign, Lightbulb, Download, Sparkles, Wand2, ArrowRight, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface PitchDeckData {
  companyName: string;
  tagline: string;
  problem: string;
  solution: string;
  marketSize: string;
  businessModel: string;
  traction: string;
  competition: string;
  team: string;
  financials: string;
  fundingAsk: string;
  useOfFunds: string;
}

interface PitchDeckAnalysis {
  overallScore: number;
  sections: {
    [key: string]: {
      score: number;
      status: 'excellent' | 'good' | 'needs_improvement' | 'missing';
      feedback: string;
      suggestions: string[];
    };
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  investorReadiness: {
    score: number;
    level: 'Not Ready' | 'Early Stage' | 'Investment Ready' | 'Highly Attractive';
    nextSteps: string[];
  };
}

export default function PitchDeckAnalyzer() {
  const [mode, setMode] = useState<'analyze' | 'generate'>('analyze');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PitchDeckAnalysis | null>(null);
  const [pitchData, setPitchData] = useState<PitchDeckData>({
    companyName: '',
    tagline: '',
    problem: '',
    solution: '',
    marketSize: '',
    businessModel: '',
    traction: '',
    competition: '',
    team: '',
    financials: '',
    fundingAsk: '',
    useOfFunds: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDeck, setGeneratedDeck] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setAnalysis(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const generatePitchDeck = async () => {
    setIsGenerating(true);
    
    // Simulate pitch deck generation
    setTimeout(() => {
      const deckContent = `
# ${pitchData.companyName} - Investor Pitch Deck

## Slide 1: Title Slide
**${pitchData.companyName}**
*${pitchData.tagline}*

Presented by: [Your Name]
Date: ${new Date().toLocaleDateString()}
Contact: [Your Email]

## Slide 2: Problem Statement
${pitchData.problem}

**Key Pain Points:**
• Market inefficiencies and gaps
• Customer frustrations and unmet needs
• Current solution limitations
• Market size and opportunity validation

## Slide 3: Solution Overview
${pitchData.solution}

**Value Proposition:**
• Unique approach to solving the problem
• Key features and benefits
• Competitive advantages
• Technology differentiators

## Slide 4: Market Opportunity
${pitchData.marketSize}

**Market Analysis:**
• Total Addressable Market (TAM)
• Serviceable Addressable Market (SAM)
• Serviceable Obtainable Market (SOM)
• Market growth trends and drivers

## Slide 5: Business Model
${pitchData.businessModel}

**Revenue Streams:**
• Primary revenue sources
• Pricing strategy and rationale
• Unit economics and scalability
• Customer acquisition cost (CAC) and lifetime value (LTV)

## Slide 6: Traction & Validation
${pitchData.traction}

**Key Metrics:**
• Customer growth and retention
• Revenue milestones
• Product development progress
• Strategic partnerships

## Slide 7: Competitive Landscape
${pitchData.competition}

**Competitive Analysis:**
• Direct and indirect competitors
• Competitive advantages
• Market positioning
• Barriers to entry

## Slide 8: Team & Advisors
${pitchData.team}

**Leadership Team:**
• Founder backgrounds and expertise
• Key team members and roles
• Advisory board
• Hiring plans and organizational structure

## Slide 9: Financial Projections
${pitchData.financials}

**5-Year Financial Forecast:**
• Revenue projections and assumptions
• Cost structure and margins
• Profitability timeline
• Key financial metrics and KPIs

## Slide 10: Funding Requirements
${pitchData.fundingAsk}

**Investment Details:**
• Funding amount requested
• Equity offered
• Valuation rationale
• Investment terms and structure

## Slide 11: Use of Funds
${pitchData.useOfFunds}

**Fund Allocation:**
• Product development (X%)
• Marketing and sales (X%)
• Team expansion (X%)
• Operations and infrastructure (X%)
• Working capital (X%)

## Slide 12: Milestones & Roadmap
**18-Month Roadmap:**
• Product development milestones
• Market expansion plans
• Revenue targets
• Team growth objectives
• Strategic partnerships

## Slide 13: Exit Strategy
**Potential Exit Opportunities:**
• Strategic acquisition targets
• IPO timeline and requirements
• Market comparables and valuations
• Investor return projections

## Slide 14: Investment Highlights
**Why Invest in ${pitchData.companyName}:**
• Large market opportunity
• Strong founding team
• Proven traction and validation
• Scalable business model
• Clear path to profitability

## Slide 15: Thank You & Q&A
**Contact Information:**
• Email: [founder@${pitchData.companyName.toLowerCase().replace(/\s+/g, '')}.com]
• Phone: [Your Phone]
• Website: [www.${pitchData.companyName.toLowerCase().replace(/\s+/g, '')}.com]
• LinkedIn: [Your LinkedIn]

**Questions & Discussion**

---

## Appendix: Supporting Materials

### A. Detailed Financial Model
• Monthly cash flow projections
• Sensitivity analysis
• Key assumptions and drivers
• Scenario planning (best/base/worst case)

### B. Market Research
• Industry reports and analysis
• Customer surveys and feedback
• Competitive intelligence
• Market sizing methodology

### C. Product Details
• Technical specifications
• Product roadmap
• Intellectual property
• Development timeline

### D. Team Bios
• Detailed founder backgrounds
• Key employee profiles
• Advisory board credentials
• Organizational chart

### E. Customer Testimonials
• Case studies
• Reference customers
• Product reviews
• Success metrics

---

**Presentation Tips:**
1. Keep slides visual and concise
2. Practice your pitch timing (10-12 minutes)
3. Prepare for common investor questions
4. Have backup slides for detailed discussions
5. Focus on storytelling and narrative flow
`;
      
      setGeneratedDeck(deckContent);
      setIsGenerating(false);
    }, 4000);
  };

  const downloadDeck = () => {
    if (!generatedDeck) return;
    
    const blob = new Blob([generatedDeck], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pitchData.companyName || 'PitchDeck'}_Generated.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const analyzePitchDeck = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    
    // Simulate comprehensive analysis
    setTimeout(() => {
      const mockAnalysis: PitchDeckAnalysis = {
        overallScore: 78,
        sections: {
          'Problem Statement': {
            score: 85,
            status: 'good',
            feedback: 'Clear problem identification with market validation',
            suggestions: ['Add more specific pain point examples', 'Include customer quotes or testimonials']
          },
          'Solution': {
            score: 90,
            status: 'excellent',
            feedback: 'Well-articulated solution with clear value proposition',
            suggestions: ['Consider adding demo screenshots', 'Highlight unique differentiators']
          },
          'Market Size': {
            score: 70,
            status: 'good',
            feedback: 'Good TAM/SAM analysis but needs more depth',
            suggestions: ['Add bottom-up market sizing', 'Include market growth trends', 'Show geographic expansion potential']
          },
          'Business Model': {
            score: 65,
            status: 'needs_improvement',
            feedback: 'Revenue model is clear but unit economics need strengthening',
            suggestions: ['Add detailed unit economics', 'Show multiple revenue streams', 'Include pricing strategy rationale']
          },
          'Traction': {
            score: 80,
            status: 'good',
            feedback: 'Strong early traction metrics shown',
            suggestions: ['Add cohort analysis', 'Show month-over-month growth', 'Include customer retention metrics']
          },
          'Competition': {
            score: 60,
            status: 'needs_improvement',
            feedback: 'Competitive analysis is superficial',
            suggestions: ['Add detailed competitive matrix', 'Show competitive advantages', 'Include market positioning']
          },
          'Team': {
            score: 85,
            status: 'good',
            feedback: 'Strong founding team with relevant experience',
            suggestions: ['Add advisory board members', 'Highlight key achievements', 'Show team expansion plans']
          },
          'Financials': {
            score: 55,
            status: 'needs_improvement',
            feedback: 'Financial projections need more detail and justification',
            suggestions: ['Add 5-year P&L projections', 'Include key assumptions', 'Show sensitivity analysis', 'Add cash flow projections']
          },
          'Funding Ask': {
            score: 75,
            status: 'good',
            feedback: 'Clear funding amount and use of funds',
            suggestions: ['Add milestone-based funding tranches', 'Show ROI projections for investors', 'Include exit strategy']
          }
        },
        strengths: [
          'Clear and compelling problem-solution fit',
          'Strong founding team with domain expertise',
          'Good early traction and customer validation',
          'Well-designed presentation with clear narrative',
          'Realistic market opportunity assessment'
        ],
        weaknesses: [
          'Financial projections lack depth and supporting assumptions',
          'Competitive analysis is too high-level',
          'Unit economics and business model need strengthening',
          'Missing key metrics like CAC, LTV, and churn rates',
          'No clear go-to-market strategy outlined'
        ],
        recommendations: [
          'Strengthen financial section with detailed 5-year projections and key assumptions',
          'Add comprehensive competitive analysis with positioning matrix',
          'Include detailed unit economics with CAC/LTV analysis',
          'Add customer testimonials and case studies for credibility',
          'Create appendix with detailed market research and validation data',
          'Include risk analysis and mitigation strategies',
          'Add clear milestones and KPIs for next 18 months'
        ],
        investorReadiness: {
          score: 78,
          level: 'Investment Ready',
          nextSteps: [
            'Refine financial projections with bottom-up analysis',
            'Prepare detailed due diligence materials',
            'Create executive summary (2-page version)',
            'Develop investor FAQ document',
            'Practice pitch delivery and Q&A sessions'
          ]
        }
      };

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      needs_improvement: 'bg-yellow-100 text-yellow-800',
      missing: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.missing;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
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
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8 text-purple-600" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pitch Deck Analyzer & Generator
            </h1>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Wand2 className="h-8 w-8 text-blue-600" />
            </motion.div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Analyze existing pitch decks or generate professional presentations with AI-powered insights
          </p>
        </motion.div>

        {/* Mode Selection */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setMode('analyze')}
                  variant={mode === 'analyze' ? 'default' : 'outline'}
                  className={`px-8 py-3 text-lg transition-all duration-300 ${
                    mode === 'analyze' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                      : 'hover:bg-blue-50'
                  }`}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Analyze Existing Deck
                </Button>
                <Button
                  onClick={() => setMode('generate')}
                  variant={mode === 'generate' ? 'default' : 'outline'}
                  className={`px-8 py-3 text-lg transition-all duration-300 ${
                    mode === 'generate' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg' 
                      : 'hover:bg-purple-50'
                  }`}
                >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate New Deck
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyze Mode */}
        <AnimatePresence mode="wait">
          {mode === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Upload Section */}
              {!analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Upload Your Pitch Deck
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Upload your PDF pitch deck for comprehensive AI analysis and scoring
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                          isDragActive 
                            ? 'border-blue-400 bg-blue-50 scale-105' 
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-25'
                        }`}
                      >
                        <input {...getInputProps()} />
                        <motion.div
                          animate={{ y: isDragActive ? -10 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FileText className="h-16 w-16 text-blue-400 mx-auto mb-6" />
                        </motion.div>
                        {isDragActive ? (
                          <motion.p 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-blue-600 text-lg font-medium"
                          >
                            Drop your pitch deck here...
                          </motion.p>
                        ) : (
                          <div>
                            <p className="text-gray-700 mb-3 text-lg font-medium">Drag & drop your pitch deck PDF here</p>
                            <p className="text-gray-500 mb-4">or click to select from your computer</p>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              Only PDF files supported
                            </Badge>
                          </div>
                        )}
                      </div>

                      {uploadedFile && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{uploadedFile.name}</p>
                                <p className="text-sm text-gray-600">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
                                </p>
                              </div>
                            </div>
                            <Button 
                              onClick={analyzePitchDeck} 
                              disabled={isAnalyzing}
                              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-6 py-2 shadow-lg"
                            >
                              {isAnalyzing ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mr-2"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                  </motion.div>
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <BarChart3 className="mr-2 h-4 w-4" />
                                  Analyze Pitch Deck
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Generate Mode */}
          {mode === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {!generatedDeck && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        Generate Your Pitch Deck
                      </CardTitle>
                      <CardDescription className="text-purple-100">
                        Answer these questions to generate a comprehensive pitch deck
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Company Name *</label>
                            <Input
                              value={pitchData.companyName}
                              onChange={(e) => setPitchData({...pitchData, companyName: e.target.value})}
                              placeholder="Enter your company name"
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Tagline *</label>
                            <Input
                              value={pitchData.tagline}
                              onChange={(e) => setPitchData({...pitchData, tagline: e.target.value})}
                              placeholder="One-line description of your company"
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Problem Statement *</label>
                          <Textarea
                            value={pitchData.problem}
                            onChange={(e) => setPitchData({...pitchData, problem: e.target.value})}
                            placeholder="Describe the problem you're solving..."
                            className="border-2 focus:border-purple-400 min-h-[100px]"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Solution *</label>
                          <Textarea
                            value={pitchData.solution}
                            onChange={(e) => setPitchData({...pitchData, solution: e.target.value})}
                            placeholder="Explain your solution and value proposition..."
                            className="border-2 focus:border-purple-400 min-h-[100px]"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Market Size *</label>
                            <Textarea
                              value={pitchData.marketSize}
                              onChange={(e) => setPitchData({...pitchData, marketSize: e.target.value})}
                              placeholder="TAM, SAM, SOM analysis..."
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Business Model *</label>
                            <Textarea
                              value={pitchData.businessModel}
                              onChange={(e) => setPitchData({...pitchData, businessModel: e.target.value})}
                              placeholder="How do you make money?"
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Traction & Metrics</label>
                            <Textarea
                              value={pitchData.traction}
                              onChange={(e) => setPitchData({...pitchData, traction: e.target.value})}
                              placeholder="Current metrics, customers, revenue..."
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Competition Analysis</label>
                            <Textarea
                              value={pitchData.competition}
                              onChange={(e) => setPitchData({...pitchData, competition: e.target.value})}
                              placeholder="Competitive landscape and advantages..."
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Team & Advisors</label>
                          <Textarea
                            value={pitchData.team}
                            onChange={(e) => setPitchData({...pitchData, team: e.target.value})}
                            placeholder="Founding team backgrounds and key hires..."
                            className="border-2 focus:border-purple-400"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Financial Projections</label>
                          <Textarea
                            value={pitchData.financials}
                            onChange={(e) => setPitchData({...pitchData, financials: e.target.value})}
                            placeholder="5-year revenue projections and key assumptions..."
                            className="border-2 focus:border-purple-400"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">Funding Ask *</label>
                            <Textarea
                              value={pitchData.fundingAsk}
                              onChange={(e) => setPitchData({...pitchData, fundingAsk: e.target.value})}
                              placeholder="How much funding and for what equity?"
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Use of Funds *</label>
                            <Textarea
                              value={pitchData.useOfFunds}
                              onChange={(e) => setPitchData({...pitchData, useOfFunds: e.target.value})}
                              placeholder="How will you use the investment?"
                              className="border-2 focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="flex justify-center pt-4">
                          <Button
                            onClick={generatePitchDeck}
                            disabled={isGenerating || !pitchData.companyName || !pitchData.problem || !pitchData.solution}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 text-lg shadow-lg"
                          >
                            {isGenerating ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <Wand2 className="h-5 w-5" />
                                </motion.div>
                                Generating Pitch Deck...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Generate Professional Pitch Deck
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Generated Deck Display */}
              {generatedDeck && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="mb-8 overflow-hidden border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Your Pitch Deck is Ready!
                      </CardTitle>
                      <CardDescription className="text-green-100">
                        Professional pitch deck generated with 15 slides and appendix
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedDeck}</pre>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={downloadDeck} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                          <Download className="mr-2 h-4 w-4" />
                          Download as Text File
                        </Button>
                        <Button onClick={() => {setGeneratedDeck(null); setPitchData({companyName: '', tagline: '', problem: '', solution: '', marketSize: '', businessModel: '', traction: '', competition: '', team: '', financials: '', fundingAsk: '', useOfFunds: ''});}} variant="outline">
                          Generate Another Deck
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Analyzing Your Pitch Deck
                </h3>
                <p className="text-gray-600 mb-8 text-lg">Our AI is evaluating your presentation across multiple dimensions...</p>
                <div className="max-w-md mx-auto">
                  <div className="space-y-4">
                    {[
                      'Extracting content and structure',
                      'Analyzing problem-solution fit', 
                      'Evaluating market opportunity',
                      'Assessing financial projections',
                      'Scoring investor readiness'
                    ].map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.5, duration: 0.5 }}
                        className="flex items-center gap-3 text-left"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.5 + 0.3, duration: 0.3 }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                        <span className="text-gray-700">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Generation Loading */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <Wand2 className="h-16 w-16 text-purple-600" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Generating Your Pitch Deck
                </h3>
                <p className="text-gray-600 mb-8 text-lg">Creating a professional presentation tailored to your startup...</p>
                <div className="max-w-md mx-auto">
                  <Progress value={75} className="h-3 mb-4" />
                  <p className="text-sm text-gray-500">Crafting 15 slides with detailed content and appendix</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Overall Analysis Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex items-center gap-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="text-center"
                    >
                      <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                        {analysis.overallScore}
                      </div>
                      <div className="text-lg text-gray-500">/ 100</div>
                    </motion.div>
                    <div className="flex-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        <Progress value={analysis.overallScore} className="h-4 mb-2" />
                      </motion.div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Needs Work</span>
                        <span>Investment Ready</span>
                      </div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="text-center"
                    >
                      <Badge className={`${getStatusBadge('good')} text-lg px-4 py-2`}>
                        {analysis.investorReadiness.level}
                      </Badge>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sections">Section Analysis</TabsTrigger>
                <TabsTrigger value="strengths">Strengths & Weaknesses</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="readiness">Investor Readiness</TabsTrigger>
              </TabsList>

              {/* Section Analysis */}
              <TabsContent value="sections" className="space-y-4">
                <div className="grid gap-4">
                  {Object.entries(analysis.sections).map(([section, data]) => (
                    <Card key={section}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{section}</h3>
                            <p className="text-sm text-gray-600">{data.feedback}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${getScoreColor(data.score)}`}>
                              {data.score}/100
                            </div>
                            <Badge className={getStatusBadge(data.status)}>
                              {data.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="mb-3">
                          <Progress value={data.score} className="h-2" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Suggestions:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {data.suggestions.map((suggestion, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Lightbulb className="h-3 w-3 mt-0.5 text-yellow-500 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Strengths & Weaknesses */}
              <TabsContent value="strengths" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Recommendations */}
              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Actionable Recommendations
                    </CardTitle>
                    <CardDescription>
                      Priority improvements to enhance your pitch deck's effectiveness
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.recommendations.map((recommendation, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Investor Readiness */}
              <TabsContent value="readiness">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Investor Readiness Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.investorReadiness.score)}`}>
                          {analysis.investorReadiness.score}/100
                        </div>
                        <Badge className={`${getStatusBadge('good')} mt-2`}>
                          {analysis.investorReadiness.level}
                        </Badge>
                      </div>
                      <Progress value={analysis.investorReadiness.score} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Not Ready</span>
                        <span>Highly Attractive</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.investorReadiness.nextSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex gap-4 justify-center pt-8"
            >
              <Button 
                onClick={() => {setAnalysis(null); setUploadedFile(null);}} 
                variant="outline"
                className="px-8 py-3 text-lg border-2 hover:bg-gray-50"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analyze Another Deck
              </Button>
              <Button className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Download className="mr-2 h-5 w-5" />
                Download Detailed Report
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}