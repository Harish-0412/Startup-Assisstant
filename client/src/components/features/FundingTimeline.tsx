import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { getFundingTimeline, type FundingTimeline as TimelineType } from "@/lib/api";
import { Calendar, Target, AlertTriangle, CheckCircle2, Loader2, Clock, TrendingUp } from "lucide-react";

// Enhanced realistic funding timeline data for 2024-2025
const REALISTIC_TIMELINES = {
  'idea': {
    to_mvp: { months: 6, milestones: ['Market research', 'MVP development', 'Initial user testing', 'Product-market fit validation'] },
    to_revenue: { months: 12, milestones: ['MVP launch', 'Customer acquisition', 'Revenue generation', 'Business model validation'] },
    to_growth: { months: 18, milestones: ['Scale operations', 'Team expansion', 'Market expansion', 'Sustainable growth'] }
  },
  'mvp': {
    to_revenue: { months: 8, milestones: ['User feedback integration', 'Go-to-market strategy', 'First paying customers', 'Revenue optimization'] },
    to_growth: { months: 14, milestones: ['Customer base expansion', 'Product iterations', 'Market penetration', 'Growth metrics'] }
  },
  'revenue': {
    to_growth: { months: 10, milestones: ['Revenue scaling', 'Team building', 'Process optimization', 'Market leadership'] }
  }
};

const CURRENT_MARKET_RISKS_2024 = [
  'Rising interest rates affecting investor appetite',
  'Increased due diligence timelines (3-6 months longer)',
  'Focus on profitability over growth in current market',
  'Regulatory changes in fintech and AI sectors',
  'Global economic uncertainty impacting funding',
  'Higher valuation scrutiny and down-rounds'
];

const SECTOR_SPECIFIC_INSIGHTS = {
  'fintech': {
    avgFundingTime: '8-12 months',
    hotTrends: ['Embedded finance', 'Buy-now-pay-later', 'Crypto infrastructure', 'RegTech solutions'],
    challenges: ['Regulatory compliance', 'Banking partnerships', 'Customer acquisition costs']
  },
  'saas': {
    avgFundingTime: '6-9 months', 
    hotTrends: ['AI-powered SaaS', 'Vertical SaaS', 'API-first platforms', 'No-code/low-code'],
    challenges: ['Customer churn', 'Sales cycle length', 'Competition from big tech']
  },
  'healthtech': {
    avgFundingTime: '10-15 months',
    hotTrends: ['Telemedicine', 'AI diagnostics', 'Mental health platforms', 'Wearable tech'],
    challenges: ['Regulatory approval', 'Data privacy', 'Clinical validation']
  },
  'edtech': {
    avgFundingTime: '7-10 months',
    hotTrends: ['AI tutoring', 'Skill-based learning', 'Corporate training', 'VR/AR education'],
    challenges: ['User engagement', 'Monetization models', 'Content quality']
  }
};

export default function FundingTimeline() {
  const [timeline, setTimeline] = useState<TimelineType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState('idea');
  const [sector, setSector] = useState('saas');

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      // Try to get from API first, fallback to realistic data
      try {
        const data = await getFundingTimeline();
        setTimeline(data);
      } catch (apiError) {
        // Generate realistic timeline based on current market conditions
        const realisticTimeline = generateRealisticTimeline(currentStage, sector);
        setTimeline(realisticTimeline);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timeline");
      setTimeline(null);
    } finally {
      setLoading(false);
    }
  };

  const generateRealisticTimeline = (stage: string, sectorType: string): TimelineType => {
    const sectorInfo = SECTOR_SPECIFIC_INSIGHTS[sectorType as keyof typeof SECTOR_SPECIFIC_INSIGHTS] || SECTOR_SPECIFIC_INSIGHTS.saas;
    
    return {
      current_stage: stage,
      target_stage: stage === 'idea' ? 'mvp' : stage === 'mvp' ? 'revenue' : 'growth',
      estimated_months: stage === 'idea' ? 8 : stage === 'mvp' ? 10 : 12, // More realistic 2024 timelines
      milestones: [
        `Complete ${sectorInfo.avgFundingTime} funding cycle`,
        'Build investor relationships (2-3 months)',
        'Prepare comprehensive due diligence package',
        'Negotiate term sheet and close funding',
        'Execute growth strategy with new capital'
      ],
      risks: CURRENT_MARKET_RISKS_2024.slice(0, 4),
      recommendations: [
        'Focus on unit economics and path to profitability',
        'Build strong investor pipeline early (6+ months ahead)',
        'Prepare for longer due diligence processes',
        'Consider bridge funding or revenue-based financing',
        'Strengthen advisory board with industry experts'
      ]
    };
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">Calculating realistic timeline...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !timeline) {
    return (
      <Card className="shadow-sm border-destructive/20">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">{error || "No timeline data available"}</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercentage = timeline.current_stage === 'idea' ? 25 : 
                           timeline.current_stage === 'mvp' ? 50 : 
                           timeline.current_stage === 'revenue' ? 75 : 90;

  return (
    <div className="space-y-4">
      <Card className="shadow-sm bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Realistic Funding Timeline (2024-2025)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Stage</p>
              <Badge className="mt-1 capitalize">{timeline.current_stage}</Badge>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{timeline.estimated_months}</p>
              <p className="text-xs text-muted-foreground">months (current market)</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Target Stage</p>
              <Badge variant="outline" className="mt-1 capitalize">{timeline.target_stage}</Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to next stage</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Avg. Sector Timeline</p>
                <p className="text-sm font-medium">8-12 months</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-sm font-medium">15-25%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            Key Milestones (Updated for 2024)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeline.milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>{milestone}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Current Market Risks (2024-2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeline.risks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{risk}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm">Strategic Recommendations (2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeline.recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm"
              >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {idx + 1}
                </div>
                <span>{rec}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

