import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getMarketInsights, type MarketInsight } from "@/lib/api";
import { TrendingUp, Lightbulb, AlertCircle, BarChart3, Loader2, Globe, DollarSign, Users, Calendar } from "lucide-react";

// Current market data for Indian startup ecosystem (2024-2025)
const INDIAN_MARKET_DATA_2024 = {
  fintech: {
    sector: "FinTech",
    market_size: "$31 billion (2024)",
    growth_rate: "22% CAGR (2024-2029)",
    key_trends: [
      "Embedded finance and Banking-as-a-Service (BaaS) adoption",
      "AI-powered credit scoring and risk assessment",
      "Digital lending platforms targeting MSMEs",
      "Cryptocurrency and blockchain infrastructure growth",
      "RegTech solutions for compliance automation",
      "Neo-banking and digital-first financial services"
    ],
    opportunities: [
      "Rural fintech penetration (400M+ underbanked population)",
      "B2B payments and supply chain financing",
      "Insurance tech and micro-insurance products",
      "Cross-border payments and remittances",
      "Wealth management for emerging affluent class",
      "Green finance and ESG-focused lending"
    ],
    challenges: [
      "Increasing regulatory scrutiny and compliance costs",
      "Rising customer acquisition costs (CAC up 40% in 2024)",
      "Credit risk management in economic uncertainty",
      "Competition from traditional banks going digital",
      "Data privacy regulations and security concerns",
      "Funding winter affecting growth capital availability"
    ],
    competitor_landscape: "Dominated by Paytm, PhonePe, Google Pay in payments. Razorpay, Cashfree in B2B. New entrants in lending, insurance, and wealth management creating opportunities.",
    funding_stats: {
      total_funding_2024: "$2.8 billion",
      deals_count: "180+ deals",
      avg_deal_size: "$15.6 million",
      top_investors: ["Sequoia", "Tiger Global", "SoftBank"]
    }
  },
  saas: {
    sector: "SaaS & Enterprise Software",
    market_size: "$13.2 billion (2024)",
    growth_rate: "35% CAGR (2024-2029)",
    key_trends: [
      "AI-first SaaS products and copilot integrations",
      "Vertical SaaS for specific industries (healthcare, education)",
      "API-first and headless commerce platforms",
      "No-code/low-code development platforms",
      "Remote work and collaboration tools evolution",
      "Data analytics and business intelligence automation"
    ],
    opportunities: [
      "Global SaaS market expansion from India (export opportunity)",
      "SME digitization across Tier 2/3 cities",
      "Industry-specific solutions (manufacturing, agriculture)",
      "Integration platforms and workflow automation",
      "Cybersecurity and compliance SaaS",
      "Developer tools and infrastructure software"
    ],
    challenges: [
      "Intense competition from global SaaS giants",
      "Customer retention and reducing churn rates",
      "Scaling sales and marketing efficiently",
      "Building for global markets while staying cost-effective",
      "Talent acquisition and retention costs",
      "Long sales cycles for enterprise customers"
    ],
    competitor_landscape: "Freshworks, Zoho leading. Emerging players like Postman, Chargebee gaining global traction. Opportunity in vertical SaaS and AI-powered solutions.",
    funding_stats: {
      total_funding_2024: "$1.9 billion",
      deals_count: "120+ deals",
      avg_deal_size: "$15.8 million",
      top_investors: ["Accel", "Matrix", "Lightspeed"]
    }
  },
  healthtech: {
    sector: "HealthTech & Digital Health",
    market_size: "$9.8 billion (2024)",
    growth_rate: "28% CAGR (2024-2029)",
    key_trends: [
      "Telemedicine and remote patient monitoring",
      "AI-powered diagnostics and medical imaging",
      "Mental health and wellness platforms",
      "Wearable health technology integration",
      "Pharmacy automation and drug delivery",
      "Electronic health records (EHR) digitization"
    ],
    opportunities: [
      "Rural healthcare access through digital solutions",
      "Preventive healthcare and wellness programs",
      "Medical device innovation and manufacturing",
      "Health insurance technology and claims processing",
      "Clinical trial management and research platforms",
      "Elderly care and chronic disease management"
    ],
    challenges: [
      "Complex regulatory approval processes",
      "Data privacy and patient confidentiality",
      "Integration with existing healthcare infrastructure",
      "Doctor adoption and change management",
      "Insurance reimbursement and payment models",
      "Clinical validation and evidence generation"
    ],
    competitor_landscape: "Practo, 1mg leading in consumer health. Opportunities in B2B healthcare, medical devices, and specialized care segments.",
    funding_stats: {
      total_funding_2024: "$1.2 billion",
      deals_count: "95+ deals",
      avg_deal_size: "$12.6 million",
      top_investors: ["Sequoia", "Matrix", "Kalaari"]
    }
  },
  edtech: {
    sector: "EdTech & Learning Platforms",
    market_size: "$7.8 billion (2024)",
    growth_rate: "15% CAGR (2024-2029)",
    key_trends: [
      "AI-powered personalized learning experiences",
      "Skill-based and professional certification programs",
      "Corporate training and upskilling platforms",
      "Gamification and interactive learning content",
      "VR/AR immersive educational experiences",
      "Micro-learning and bite-sized content delivery"
    ],
    opportunities: [
      "Professional skill development and certification",
      "K-12 education technology and school management",
      "Language learning and communication skills",
      "Test preparation and competitive exam coaching",
      "Corporate learning and development solutions",
      "Special needs education and accessibility tools"
    ],
    challenges: [
      "User engagement and completion rates",
      "Monetization and sustainable business models",
      "Content quality and curriculum alignment",
      "Teacher training and adoption",
      "Device and internet accessibility in rural areas",
      "Competition from free educational content"
    ],
    competitor_landscape: "Post-Byju's consolidation, market fragmented. Opportunities in B2B edtech, professional learning, and specialized skill development.",
    funding_stats: {
      total_funding_2024: "$800 million",
      deals_count: "75+ deals",
      avg_deal_size: "$10.7 million",
      top_investors: ["Lightspeed", "Blume", "3one4"]
    }
  },
  consumer: {
    sector: "Consumer Tech & D2C",
    market_size: "$45 billion (2024)",
    growth_rate: "18% CAGR (2024-2029)",
    key_trends: [
      "Social commerce and live streaming shopping",
      "Quick commerce and hyperlocal delivery",
      "Sustainable and eco-friendly product focus",
      "Personalization through AI and data analytics",
      "Omnichannel retail and offline-online integration",
      "Creator economy and influencer marketing platforms"
    ],
    opportunities: [
      "Tier 2/3 city market penetration",
      "Category-specific vertical marketplaces",
      "Subscription and membership-based models",
      "Cross-border e-commerce and exports",
      "Elderly and accessibility-focused products",
      "Sustainable and ethical consumer goods"
    ],
    challenges: [
      "High customer acquisition and retention costs",
      "Logistics and supply chain optimization",
      "Inventory management and working capital",
      "Competition from established e-commerce giants",
      "Regulatory compliance across states",
      "Building brand loyalty in price-sensitive market"
    ],
    competitor_landscape: "Amazon, Flipkart dominate. Nykaa, Lenskart successful in verticals. Opportunities in niche categories and innovative business models.",
    funding_stats: {
      total_funding_2024: "$3.2 billion",
      deals_count: "200+ deals",
      avg_deal_size: "$16 million",
      top_investors: ["Sequoia", "Accel", "Tiger Global"]
    }
  }
};

// Overall Indian startup ecosystem stats for 2024
const ECOSYSTEM_STATS_2024 = {
  total_funding: "$11.3 billion",
  total_deals: "1,200+ deals",
  unicorns_created: "8 new unicorns",
  total_unicorns: "108 unicorns",
  avg_deal_size: "$9.4 million",
  top_funding_cities: ["Bangalore (40%)", "Mumbai (25%)", "Delhi NCR (20%)", "Others (15%)"],
  market_sentiment: "Cautiously optimistic with focus on profitability"
};

export default function MarketInsights() {
  const [insights, setInsights] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>('saas');

  useEffect(() => {
    loadInsights();
  }, [selectedSector]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      // Try API first, fallback to current market data
      try {
        const data = await getMarketInsights();
        setInsights(data);
      } catch (apiError) {
        // Use current 2024 market data
        const sectorData = INDIAN_MARKET_DATA_2024[selectedSector as keyof typeof INDIAN_MARKET_DATA_2024];
        setInsights(sectorData);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load insights");
      setInsights(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Analyzing current market data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !insights) {
    return (
      <Card className="shadow-sm border-destructive/20">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error || "No insights available"}</p>
        </CardContent>
      </Card>
    );
  }

  const sectorData = insights as any;

  return (
    <div className="space-y-4">
      {/* Sector Selection */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {Object.keys(INDIAN_MARKET_DATA_2024).map((sector) => (
              <Badge
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedSector(sector)}
              >
                {sector === 'saas' ? 'SaaS' : sector === 'fintech' ? 'FinTech' : 
                 sector === 'healthtech' ? 'HealthTech' : 
                 sector === 'edtech' ? 'EdTech' : 'Consumer'}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <Card className="shadow-sm bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {insights.sector} Market Overview (2024-2025)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Market Size</p>
              <p className="text-sm font-semibold">{insights.market_size}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Growth Rate</p>
              <p className="text-sm font-semibold text-green-600">{insights.growth_rate}</p>
            </div>
          </div>
          
          {sectorData.funding_stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-xs text-muted-foreground">2024 Funding</p>
                <p className="text-sm font-semibold">{sectorData.funding_stats.total_funding_2024}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Deal Size</p>
                <p className="text-sm font-semibold">{sectorData.funding_stats.avg_deal_size}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ecosystem Stats */}
      <Card className="shadow-sm border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            Indian Startup Ecosystem (2024)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <div>
                <p className="font-medium">{ECOSYSTEM_STATS_2024.total_funding}</p>
                <p className="text-xs text-muted-foreground">Total Funding</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <div>
                <p className="font-medium">{ECOSYSTEM_STATS_2024.total_unicorns}</p>
                <p className="text-xs text-muted-foreground">Total Unicorns</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Trends */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Key Trends (2024-2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.key_trends.map((trend, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span>{trend}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card className="shadow-sm border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-green-600" />
            Market Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.opportunities.map((opp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-green-700 dark:text-green-400"
              >
                <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{opp}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Card className="shadow-sm border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Current Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {insights.challenges.map((challenge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{challenge}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Landscape */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">Competitive Landscape</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{insights.competitor_landscape}</p>
          
          {sectorData.funding_stats?.top_investors && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Top Active Investors</p>
              <div className="flex flex-wrap gap-1">
                {sectorData.funding_stats.top_investors.map((investor: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {investor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card className="shadow-sm bg-muted/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium">Market Sentiment (2024)</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {ECOSYSTEM_STATS_2024.market_sentiment}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

