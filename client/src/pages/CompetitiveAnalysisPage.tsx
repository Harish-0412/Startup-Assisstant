import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Users, Target, Zap, Shield, Award, ArrowRight, BarChart3, Globe, Star, AlertTriangle, Sparkles, Brain, Rocket, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CompetitorAnalysis {
  directCompetitors: string[];
  indirectCompetitors: string[];
  differentiationStrength: 'Strong' | 'Moderate' | 'Weak';
  standOut: string[];
  dontStandOut: string[];
  riskFlag: string | null;
  improvements: string[];
  moatAnalysis: {
    current: string[];
    potential: string[];
    strength: number;
  };
}

export default function CompetitiveAnalysisPage() {
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [geography, setGeography] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const analyzeCompetition = () => {
    if (!startupName || !description || !sector || !targetCustomer || !geography) return;
    
    setIsAnalyzing(true);
    setCurrentStep(0);
    
    const steps = [
      'Analyzing market landscape...',
      'Identifying direct competitors...',
      'Mapping indirect competition...',
      'Evaluating differentiation...',
      'Assessing competitive moats...',
      'Generating strategic insights...'
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      setCurrentStep(stepIndex);
      stepIndex++;
      if (stepIndex >= steps.length) {
        clearInterval(stepInterval);
      }
    }, 500);
    
    setTimeout(() => {
      const result = performInvestorGradeAnalysis({
        startupName,
        description: description.toLowerCase(),
        sector: sector.toLowerCase(),
        targetCustomer: targetCustomer.toLowerCase(),
        geography
      });
      
      setAnalysis(result);
      setIsAnalyzing(false);
      clearInterval(stepInterval);
    }, 3000);
  };

  const performInvestorGradeAnalysis = (input: any): CompetitorAnalysis => {
    const { description, sector, targetCustomer, geography } = input;
    
    const directCompetitors = identifyDirectCompetitors(description, sector, targetCustomer, geography);
    const indirectCompetitors = identifyIndirectCompetitors(description, sector, targetCustomer);
    const differentiationAnalysis = analyzeDifferentiation(description, sector, directCompetitors);
    const riskFlag = assessMeTooRisk(differentiationAnalysis.strength, directCompetitors.length);
    const moatAnalysis = generateMoatAnalysis(description, sector);
    
    return {
      directCompetitors,
      indirectCompetitors,
      differentiationStrength: differentiationAnalysis.strength,
      standOut: differentiationAnalysis.standOut,
      dontStandOut: differentiationAnalysis.dontStandOut,
      riskFlag,
      improvements: generateImprovements(differentiationAnalysis.strength, sector, geography),
      moatAnalysis
    };
  };

  const identifyDirectCompetitors = (desc: string, sector: string, customer: string, geo: string) => {
    const competitorMap = {
      fintech: {
        india: ['Razorpay', 'Paytm', 'PhonePe', 'BharatPe', 'Cred', 'Slice'],
        global: ['Stripe', 'Square', 'PayPal', 'Adyen', 'Klarna', 'Affirm']
      },
      saas: {
        india: ['Freshworks', 'Zoho', 'Postman', 'Chargebee', 'Mindtickle'],
        global: ['Salesforce', 'HubSpot', 'Slack', 'Zoom', 'Atlassian', 'ServiceNow']
      },
      healthtech: {
        india: ['Practo', 'PharmEasy', '1mg', 'Cure.fit', 'Lybrate'],
        global: ['Teladoc', 'Veracyte', 'Oscar Health', 'Ro', 'Hims']
      },
      edtech: {
        india: ['BYJU\'S', 'Unacademy', 'Vedantu', 'Toppr', 'Eruditus'],
        global: ['Coursera', 'Udemy', 'Khan Academy', 'Duolingo', 'MasterClass']
      }
    };
    
    const geoKey = geo.toLowerCase() === 'india' ? 'india' : 'global';
    const competitors = competitorMap[sector]?.[geoKey] || [];
    
    if (desc.includes('payment')) return competitors.slice(0, 3);
    if (desc.includes('lending')) return ['Lendingkart', 'Capital Float', 'InCred'];
    if (desc.includes('crm')) return ['Salesforce', 'HubSpot', 'Pipedrive'];
    
    return competitors.slice(0, 4);
  };

  const identifyIndirectCompetitors = (desc: string, sector: string, customer: string) => {
    if (desc.includes('payment') && customer.includes('small business')) {
      return ['Traditional banks', 'Cash transactions', 'Cheque payments', 'UPI apps'];
    }
    if (desc.includes('crm') && customer.includes('sales')) {
      return ['Excel spreadsheets', 'Email tools', 'WhatsApp Business', 'Manual processes'];
    }
    if (desc.includes('health') && customer.includes('patient')) {
      return ['Traditional clinics', 'Hospital visits', 'Pharmacy chains', 'Insurance providers'];
    }
    return ['Traditional solutions', 'Manual processes', 'Legacy software', 'Offline alternatives'];
  };

  const analyzeDifferentiation = (desc: string, sector: string, competitors: string[]) => {
    let standOut: string[] = [];
    let dontStandOut: string[] = [];
    let strength: 'Strong' | 'Moderate' | 'Weak' = 'Weak';
    
    if (desc.includes('ai') || desc.includes('machine learning')) {
      standOut.push('AI/ML technology integration');
    }
    if (desc.includes('india') || desc.includes('local') || desc.includes('vernacular')) {
      standOut.push('India-specific localization');
    }
    if (desc.includes('small business') || desc.includes('sme')) {
      standOut.push('SME-focused approach');
    }
    if (desc.includes('affordable') || desc.includes('low cost')) {
      standOut.push('Cost-effective pricing');
    }
    
    if (desc.includes('easy to use') || desc.includes('user friendly')) {
      dontStandOut.push('Generic UX claims (everyone says this)');
    }
    if (desc.includes('fast') || desc.includes('quick')) {
      dontStandOut.push('Speed claims (table stakes)');
    }
    if (desc.includes('secure') || desc.includes('safe')) {
      dontStandOut.push('Security features (expected baseline)');
    }
    if (competitors.length > 5) {
      dontStandOut.push('Crowded market with established players');
    }
    
    if (standOut.length >= 2 && dontStandOut.length <= 1) strength = 'Strong';
    else if (standOut.length >= 1 && dontStandOut.length <= 2) strength = 'Moderate';
    
    return { strength, standOut, dontStandOut };
  };

  const assessMeTooRisk = (strength: string, competitorCount: number): string | null => {
    if (strength === 'Weak' && competitorCount >= 3) {
      return 'HIGH RISK: Your differentiation is unclear. Investors will likely see this as a me-too startup.';
    }
    if (strength === 'Moderate' && competitorCount >= 5) {
      return 'MODERATE RISK: Differentiation exists but may not be compelling enough in a crowded market.';
    }
    return null;
  };

  const generateImprovements = (strength: string, sector: string, geography: string) => {
    const base = [
      'Focus on a specific customer segment or use case',
      'Develop proprietary technology or data advantages',
      'Build strong network effects or switching costs'
    ];
    
    if (geography === 'India') {
      base.push('Leverage India-specific regulations, languages, or market dynamics');
    }
    
    if (strength === 'Weak') {
      return [
        'URGENT: Clearly define your unique value proposition',
        'Consider pivoting to an underserved niche',
        ...base
      ];
    }
    
    return base;
  };

  const generateMoatAnalysis = (desc: string, sector: string) => {
    const current = [];
    const potential = [];
    
    if (desc.includes('ai') || desc.includes('machine learning')) {
      current.push('AI/ML technology advantage');
    }
    if (desc.includes('network') || desc.includes('community')) {
      current.push('Network effects');
    }
    if (desc.includes('data') || desc.includes('analytics')) {
      current.push('Data accumulation advantage');
    }
    
    if (sector.toLowerCase() === 'fintech') {
      potential.push('Regulatory compliance expertise');
      potential.push('Banking partnerships');
      potential.push('Transaction data network effects');
    } else if (sector.toLowerCase() === 'saas') {
      potential.push('Integration ecosystem');
      potential.push('Customer workflow lock-in');
      potential.push('Usage data insights');
    }
    
    if (!desc.includes('brand')) potential.push('Brand recognition');
    if (!desc.includes('patent')) potential.push('Intellectual property');
    if (!desc.includes('exclusive')) potential.push('Exclusive partnerships');
    
    const strength = Math.min(90, (current.length * 20) + (potential.length * 10) + 30);
    
    return { current, potential, strength };
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'Weak': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
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
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-10 w-10 text-purple-600" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Competitive Intelligence
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-10 w-10 text-blue-600" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced competitive analysis powered by investor-grade intelligence algorithms
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Rocket className="h-6 w-6" />
                Startup Intelligence Analysis
              </CardTitle>
              <CardDescription className="text-purple-100">
                Enter your startup details for comprehensive competitive intelligence
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-2">Startup Name</label>
                  <Input
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Enter your startup name"
                    className="border-2 focus:border-purple-400 transition-colors"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger className="border-2 focus:border-purple-400">
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="agritech">AgriTech</SelectItem>
                      <SelectItem value="d2c">D2C</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="md:col-span-2"
                >
                  <label className="block text-sm font-medium mb-2">Business Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your startup does, key features, and value proposition..."
                    className="border-2 focus:border-purple-400 min-h-[100px]"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-2">Target Customer</label>
                  <Input
                    value={targetCustomer}
                    onChange={(e) => setTargetCustomer(e.target.value)}
                    placeholder="e.g., Small businesses, Consumers, Enterprises"
                    className="border-2 focus:border-purple-400"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-2">Geography</label>
                  <Select value={geography} onValueChange={setGeography}>
                    <SelectTrigger className="border-2 focus:border-purple-400">
                      <SelectValue placeholder="Select geography" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Global">Global</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-center mt-8"
              >
                <Button
                  onClick={analyzeCompetition}
                  disabled={isAnalyzing || !startupName || !description || !sector || !targetCustomer || !geography}
                  className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Brain className="h-5 w-5" />
                      </motion.div>
                      Analyzing Intelligence...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Analyze Competition
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analysis Loading */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-6"
                >
                  <div className="h-16 w-16 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Intelligence Processing
                </h3>
                <p className="text-gray-600 mb-8 text-lg">Analyzing competitive landscape with advanced algorithms...</p>
                <div className="max-w-md mx-auto">
                  <Progress value={(currentStep + 1) * 16.67} className="h-3 mb-4" />
                  <div className="space-y-2">
                    {[
                      'Analyzing market landscape...',
                      'Identifying direct competitors...',
                      'Mapping indirect competition...',
                      'Evaluating differentiation...',
                      'Assessing competitive moats...',
                      'Generating strategic insights...'
                    ].map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: idx <= currentStep ? 1 : 0.3 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        {idx <= currentStep ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                        )}
                        {step}
                      </motion.div>
                    ))}
                  </div>
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
            className="space-y-8"
          >
            {/* Risk Assessment */}
            {analysis.riskFlag && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-red-200 bg-red-50 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-red-800 mb-2">Investment Risk Alert</h3>
                        <p className="text-red-700">{analysis.riskFlag}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="competitors">Competitors</TabsTrigger>
                <TabsTrigger value="differentiation">Differentiation</TabsTrigger>
                <TabsTrigger value="strategy">Strategy</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
                      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Differentiation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <Badge className={`${getStrengthColor(analysis.differentiationStrength)} text-lg px-4 py-2 mb-4`}>
                          {analysis.differentiationStrength}
                        </Badge>
                        <Progress 
                          value={analysis.differentiationStrength === 'Strong' ? 85 : analysis.differentiationStrength === 'Moderate' ? 60 : 35} 
                          className="h-3" 
                        />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Competitive Moat
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {analysis.moatAnalysis.strength}/100
                        </div>
                        <Progress value={analysis.moatAnalysis.strength} className="h-3" />
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50">
                      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Market Density
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">
                          {analysis.directCompetitors.length}
                        </div>
                        <p className="text-sm text-gray-600">Direct Competitors</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent value="competitors" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                      <CardTitle>Direct Competitors</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {analysis.directCompetitors.map((competitor, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
                          >
                            <Target className="h-4 w-4 text-red-600" />
                            <span className="font-medium">{competitor}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <CardTitle>Indirect Competitors</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {analysis.indirectCompetitors.map((competitor, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{competitor}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="differentiation" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Competitive Advantages
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {analysis.standOut.map((advantage, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-green-50 rounded-lg"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <span className="text-sm">{advantage}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Areas of Concern
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {analysis.dontStandOut.map((concern, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
                          >
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                            <span className="text-sm">{concern}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="strategy" className="space-y-6">
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5" />
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {analysis.improvements.map((improvement, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.2 }}
                          className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </div>
                            <h3 className="font-semibold text-lg text-purple-800">
                              {improvement.includes('URGENT') ? 'Critical Priority' : 'Strategic Initiative'}
                            </h3>
                          </div>
                          <p className="text-gray-700 ml-11">{improvement}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}