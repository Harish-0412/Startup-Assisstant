import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';
import { Dock } from '@/components/ui/Dock';
import { CheckCircle, Circle, Clock, Target, TrendingUp, Users, DollarSign, Lightbulb } from 'lucide-react';

export default function ActionPlansPage() {
  const [selectedStage, setSelectedStage] = useState('mvp');
  const [selectedSector, setSelectedSector] = useState('saas');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedTimeframe, setSelectedTimeframe] = useState('90days');
  const [completedTasks, setCompletedTasks] = useState(new Set());

  // Comprehensive action plans based on stage, sector, and state
  const actionPlans = {
    'idea': {
      title: 'Idea to MVP Journey',
      duration: '3-6 months',
      phases: [
        {
          name: 'Market Validation',
          duration: '4-6 weeks',
          tasks: [
            'Conduct 50+ customer interviews',
            'Create detailed user personas',
            'Validate problem-solution fit',
            'Analyze competitor landscape',
            'Define unique value proposition'
          ]
        },
        {
          name: 'MVP Development',
          duration: '8-12 weeks',
          tasks: [
            'Design core product features',
            'Build minimum viable product',
            'Set up basic analytics',
            'Create landing page',
            'Establish feedback loops'
          ]
        },
        {
          name: 'Initial Traction',
          duration: '4-8 weeks',
          tasks: [
            'Launch beta version',
            'Acquire first 100 users',
            'Gather user feedback',
            'Iterate based on insights',
            'Prepare for funding'
          ]
        }
      ]
    },
    'mvp': {
      title: 'MVP to Revenue',
      duration: '6-9 months',
      phases: [
        {
          name: 'Product-Market Fit',
          duration: '8-12 weeks',
          tasks: [
            'Achieve 40%+ user retention',
            'Implement user feedback',
            'Optimize core features',
            'Establish pricing strategy',
            'Build customer success processes'
          ]
        },
        {
          name: 'Revenue Generation',
          duration: '12-16 weeks',
          tasks: [
            'Launch paid version',
            'Acquire 100+ paying customers',
            'Achieve ₹5L+ monthly revenue',
            'Implement sales processes',
            'Build customer support'
          ]
        },
        {
          name: 'Scale Preparation',
          duration: '8-12 weeks',
          tasks: [
            'Hire key team members',
            'Establish operational processes',
            'Prepare funding materials',
            'Build strategic partnerships',
            'Plan market expansion'
          ]
        }
      ]
    },
    'revenue': {
      title: 'Revenue to Growth',
      duration: '9-12 months',
      phases: [
        {
          name: 'Revenue Optimization',
          duration: '12-16 weeks',
          tasks: [
            'Achieve ₹50L+ ARR',
            'Optimize unit economics',
            'Reduce customer churn <5%',
            'Implement upselling strategies',
            'Build referral programs'
          ]
        },
        {
          name: 'Market Expansion',
          duration: '16-20 weeks',
          tasks: [
            'Enter new market segments',
            'Launch in 3+ cities',
            'Build distribution channels',
            'Establish brand presence',
            'Scale marketing efforts'
          ]
        },
        {
          name: 'Funding & Scale',
          duration: '12-16 weeks',
          tasks: [
            'Raise Series A funding',
            'Hire senior leadership',
            'Implement advanced analytics',
            'Build competitive moats',
            'Plan international expansion'
          ]
        }
      ]
    },
    'growth': {
      title: 'Growth to Scale',
      duration: '12-18 months',
      phases: [
        {
          name: 'Market Leadership',
          duration: '16-20 weeks',
          tasks: [
            'Achieve market leadership position',
            'Build strategic partnerships',
            'Implement advanced features',
            'Establish thought leadership',
            'Create ecosystem plays'
          ]
        },
        {
          name: 'Operational Excellence',
          duration: '20-24 weeks',
          tasks: [
            'Implement robust processes',
            'Build data-driven culture',
            'Establish quality systems',
            'Create innovation labs',
            'Build talent pipeline'
          ]
        },
        {
          name: 'Exit Preparation',
          duration: '16-20 weeks',
          tasks: [
            'Prepare for Series B/IPO',
            'Build acquisition pipeline',
            'Establish global presence',
            'Create exit strategies',
            'Build sustainable moats'
          ]
        }
      ]
    }
  };

  // Sector-specific strategies
  const sectorStrategies = {
    'saas': {
      keyMetrics: ['MRR', 'Churn Rate', 'CAC', 'LTV'],
      criticalActions: [
        'Focus on product-led growth',
        'Build strong onboarding',
        'Implement usage analytics',
        'Create API ecosystem'
      ],
      fundingTips: [
        'Demonstrate strong unit economics',
        'Show predictable revenue growth',
        'Build international customer base',
        'Focus on enterprise clients'
      ]
    },
    'fintech': {
      keyMetrics: ['Transaction Volume', 'User Acquisition', 'Compliance Score', 'Revenue per User'],
      criticalActions: [
        'Ensure regulatory compliance',
        'Build trust and security',
        'Focus on user experience',
        'Create network effects'
      ],
      fundingTips: [
        'Demonstrate regulatory readiness',
        'Show strong user growth',
        'Build partnerships with banks',
        'Focus on financial inclusion'
      ]
    },
    'healthtech': {
      keyMetrics: ['Patient Outcomes', 'Doctor Adoption', 'Regulatory Approvals', 'Cost Savings'],
      criticalActions: [
        'Get necessary approvals',
        'Build doctor network',
        'Ensure data privacy',
        'Demonstrate clinical efficacy'
      ],
      fundingTips: [
        'Show clinical validation',
        'Demonstrate cost effectiveness',
        'Build healthcare partnerships',
        'Focus on patient outcomes'
      ]
    },
    'edtech': {
      keyMetrics: ['Student Engagement', 'Learning Outcomes', 'Completion Rates', 'Teacher Adoption'],
      criticalActions: [
        'Focus on learning outcomes',
        'Build engaging content',
        'Ensure accessibility',
        'Create assessment tools'
      ],
      fundingTips: [
        'Demonstrate learning efficacy',
        'Show strong engagement metrics',
        'Build institutional partnerships',
        'Focus on skill development'
      ]
    }
  };

  // State-specific advantages and strategies
  const stateStrategies = {
    'Karnataka': {
      advantages: ['Tech Ecosystem', 'VC Presence', 'Talent Pool', 'Global Connectivity'],
      strategies: [
        'Leverage Bangalore tech ecosystem',
        'Access top-tier VCs and angels',
        'Hire from premier institutions',
        'Build global customer base'
      ],
      resources: [
        'Karnataka Startup Policy benefits',
        'KITS (Karnataka IT Society) support',
        'Bangalore startup events',
        'Government grants and incentives'
      ]
    },
    'Maharashtra': {
      advantages: ['Financial Hub', 'Corporate Presence', 'Infrastructure', 'Market Access'],
      strategies: [
        'Leverage Mumbai financial ecosystem',
        'Build corporate partnerships',
        'Access angel networks',
        'Focus on B2B opportunities'
      ],
      resources: [
        'Maharashtra Startup Policy',
        'Mumbai Angels network',
        'Corporate accelerators',
        'Export promotion schemes'
      ]
    },
    'Delhi': {
      advantages: ['Government Access', 'Policy Hub', 'Large Market', 'Connectivity'],
      strategies: [
        'Leverage government connections',
        'Access policy makers',
        'Build in large consumer market',
        'Focus on North India expansion'
      ],
      resources: [
        'Startup India benefits',
        'Government schemes access',
        'Delhi startup ecosystem',
        'Export facilitation'
      ]
    },
    'Tamil Nadu': {
      advantages: ['Manufacturing Hub', 'Port Access', 'Education', 'Cost Advantage'],
      strategies: [
        'Leverage manufacturing ecosystem',
        'Build export-oriented business',
        'Access quality talent',
        'Focus on cost optimization'
      ],
      resources: [
        'Tamil Nadu Startup Policy',
        'TIDCO support schemes',
        'Export promotion',
        'Manufacturing incentives'
      ]
    },
    'Telangana': {
      advantages: ['T-Hub Support', 'Government Push', 'Cost Advantage', 'Growing Ecosystem'],
      strategies: [
        'Leverage T-Hub ecosystem',
        'Access government support',
        'Build cost-effective operations',
        'Focus on emerging sectors'
      ],
      resources: [
        'T-Hub incubation programs',
        'Telangana State Innovation Cell',
        'Government funding schemes',
        'Startup friendly policies'
      ]
    }
  };

  // 90-day sprint plans
  const sprintPlans = {
    '30days': {
      title: '30-Day Quick Wins',
      focus: 'Immediate Impact',
      tasks: [
        { task: 'Complete market research', priority: 'High', effort: 'Medium' },
        { task: 'Build MVP prototype', priority: 'High', effort: 'High' },
        { task: 'Validate with 20 customers', priority: 'High', effort: 'Medium' },
        { task: 'Set up basic analytics', priority: 'Medium', effort: 'Low' },
        { task: 'Create social media presence', priority: 'Medium', effort: 'Low' }
      ]
    },
    '90days': {
      title: '90-Day Transformation',
      focus: 'Foundation Building',
      tasks: [
        { task: 'Launch beta version', priority: 'High', effort: 'High' },
        { task: 'Acquire 100+ users', priority: 'High', effort: 'High' },
        { task: 'Implement feedback loops', priority: 'High', effort: 'Medium' },
        { task: 'Build core team', priority: 'Medium', effort: 'Medium' },
        { task: 'Establish partnerships', priority: 'Medium', effort: 'Medium' },
        { task: 'Prepare funding materials', priority: 'Medium', effort: 'High' },
        { task: 'Set up legal structure', priority: 'Low', effort: 'Medium' },
        { task: 'Create brand identity', priority: 'Low', effort: 'Medium' }
      ]
    },
    '180days': {
      title: '180-Day Scale Plan',
      focus: 'Growth & Revenue',
      tasks: [
        { task: 'Achieve product-market fit', priority: 'High', effort: 'High' },
        { task: 'Generate first revenue', priority: 'High', effort: 'High' },
        { task: 'Scale to 1000+ users', priority: 'High', effort: 'High' },
        { task: 'Hire key positions', priority: 'Medium', effort: 'Medium' },
        { task: 'Expand to new markets', priority: 'Medium', effort: 'High' },
        { task: 'Raise seed funding', priority: 'Medium', effort: 'High' },
        { task: 'Build advanced features', priority: 'Low', effort: 'High' },
        { task: 'Establish thought leadership', priority: 'Low', effort: 'Medium' }
      ]
    }
  };

  const toggleTask = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const getProgressPercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter((_, index) => completedTasks.has(`${selectedStage}-${index}`)).length;
    return (completed / tasks.length) * 100;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🎯 Personalized Action Plans</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Strategic roadmaps tailored to your startup stage, sector, and location
        </p>
        
        {/* Configuration */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="idea">💡 Idea Stage</SelectItem>
              <SelectItem value="mvp">🚀 MVP Stage</SelectItem>
              <SelectItem value="revenue">💰 Revenue Stage</SelectItem>
              <SelectItem value="growth">📈 Growth Stage</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="healthtech">Healthtech</SelectItem>
              <SelectItem value="edtech">Edtech</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Karnataka">Karnataka</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Delhi">Delhi NCR</SelectItem>
              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              <SelectItem value="Telangana">Telangana</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
              <SelectItem value="180days">180 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="roadmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="roadmap">🗺️ Roadmap</TabsTrigger>
          <TabsTrigger value="sprints">⚡ Sprints</TabsTrigger>
          <TabsTrigger value="strategies">🎯 Strategies</TabsTrigger>
          <TabsTrigger value="resources">📚 Resources</TabsTrigger>
          <TabsTrigger value="tracker">📊 Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-6">
          {/* Current Plan Overview */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {actionPlans[selectedStage]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-2xl font-bold text-blue-600">{actionPlans[selectedStage]?.duration}</p>
                </div>
                <div>
                  <p className="font-medium">Phases</p>
                  <p className="text-2xl font-bold text-green-600">{actionPlans[selectedStage]?.phases?.length}</p>
                </div>
                <div>
                  <p className="font-medium">Total Tasks</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {actionPlans[selectedStage]?.phases?.reduce((acc, phase) => acc + phase.tasks.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Phases */}
          <div className="space-y-6">
            {actionPlans[selectedStage]?.phases?.map((phase, phaseIndex) => (
              <Card key={phaseIndex} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {phaseIndex + 1}
                      </div>
                      {phase.name}
                    </div>
                    <Badge variant="outline">{phase.duration}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {phase.tasks.filter((_, taskIndex) => 
                          completedTasks.has(`${selectedStage}-${phaseIndex}-${taskIndex}`)
                        ).length} / {phase.tasks.length}
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(phase.tasks.map((_, i) => `${selectedStage}-${phaseIndex}-${i}`))} 
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {phase.tasks.map((task, taskIndex) => {
                      const taskId = `${selectedStage}-${phaseIndex}-${taskIndex}`;
                      const isCompleted = completedTasks.has(taskId);
                      
                      return (
                        <div 
                          key={taskIndex}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleTask(taskId)}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                          <span className={`flex-1 ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                            {task}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sprints" className="space-y-6">
          {/* Sprint Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {sprintPlans[selectedTimeframe]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Badge variant="default" className="mb-2">{sprintPlans[selectedTimeframe]?.focus}</Badge>
                <p className="text-muted-foreground">
                  Focused execution plan for maximum impact in {selectedTimeframe.replace('days', ' days')}
                </p>
              </div>
              
              <div className="space-y-3">
                {sprintPlans[selectedTimeframe]?.tasks?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.task}</h4>
                    </div>
                    <div className="flex gap-2">
                      <Badge 
                        variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}
                      >
                        {item.priority}
                      </Badge>
                      <Badge variant="outline">
                        {item.effort} Effort
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => (
              <Card key={week}>
                <CardHeader>
                  <CardTitle className="text-lg">{week}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sprintPlans[selectedTimeframe]?.tasks?.slice(index * 2, (index + 1) * 2).map((task, taskIndex) => (
                      <div key={taskIndex} className="p-2 bg-muted rounded text-sm">
                        {task.task}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          {/* Sector Strategy */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {selectedSector.toUpperCase()} Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Metrics to Track</h4>
                  <div className="flex flex-wrap gap-2">
                    {sectorStrategies[selectedSector]?.keyMetrics?.map((metric, index) => (
                      <Badge key={index} variant="secondary">{metric}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Critical Actions</h4>
                  <ul className="space-y-1">
                    {sectorStrategies[selectedSector]?.criticalActions?.map((action, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Funding Tips</h4>
                  <ul className="space-y-1">
                    {sectorStrategies[selectedSector]?.fundingTips?.map((tip, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* State Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {selectedState} Advantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Advantages</h4>
                  <div className="flex flex-wrap gap-2">
                    {stateStrategies[selectedState]?.advantages?.map((advantage, index) => (
                      <Badge key={index} variant="outline">{advantage}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recommended Strategies</h4>
                  <ul className="space-y-1">
                    {stateStrategies[selectedState]?.strategies?.map((strategy, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Available Resources</h4>
                  <ul className="space-y-1">
                    {stateStrategies[selectedState]?.resources?.map((resource, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Success Framework for {selectedSector.toUpperCase()} in {selectedState}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600">Foundation (Months 1-3)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Validate market demand locally</li>
                    <li>• Build MVP with core features</li>
                    <li>• Establish local partnerships</li>
                    <li>• Set up legal and compliance</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">Growth (Months 4-9)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Scale customer acquisition</li>
                    <li>• Optimize product-market fit</li>
                    <li>• Build revenue streams</li>
                    <li>• Expand team strategically</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-600">Scale (Months 10+)</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Expand to other markets</li>
                    <li>• Raise growth funding</li>
                    <li>• Build competitive moats</li>
                    <li>• Plan exit strategies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          {/* Resource Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Funding Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Government Schemes</h4>
                  <p className="text-sm text-muted-foreground">SISFS, PMMY, Stand Up India</p>
                  <Button variant="outline" size="sm" className="mt-2">Explore</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Angel Networks</h4>
                  <p className="text-sm text-muted-foreground">IAN, Mumbai Angels, Lead Angels</p>
                  <Button variant="outline" size="sm" className="mt-2">Connect</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">VC Firms</h4>
                  <p className="text-sm text-muted-foreground">Sequoia, Accel, Matrix Partners</p>
                  <Button variant="outline" size="sm" className="mt-2">Research</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Ecosystem Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Incubators</h4>
                  <p className="text-sm text-muted-foreground">T-Hub, NASSCOM, IIT Incubators</p>
                  <Button variant="outline" size="sm" className="mt-2">Apply</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Accelerators</h4>
                  <p className="text-sm text-muted-foreground">Techstars, 500 Startups, Axilor</p>
                  <Button variant="outline" size="sm" className="mt-2">Join</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Mentorship</h4>
                  <p className="text-sm text-muted-foreground">Industry experts, successful founders</p>
                  <Button variant="outline" size="sm" className="mt-2">Find Mentors</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Learning Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Online Courses</h4>
                  <p className="text-sm text-muted-foreground">Coursera, Udemy, edX startup courses</p>
                  <Button variant="outline" size="sm" className="mt-2">Learn</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Industry Reports</h4>
                  <p className="text-sm text-muted-foreground">NASSCOM, Bain, BCG reports</p>
                  <Button variant="outline" size="sm" className="mt-2">Download</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold">Networking Events</h4>
                  <p className="text-sm text-muted-foreground">TiE, NASSCOM, local meetups</p>
                  <Button variant="outline" size="sm" className="mt-2">Attend</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* State-specific Resources */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedState} Specific Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Government Support</h4>
                  <div className="space-y-2">
                    {stateStrategies[selectedState]?.resources?.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{resource}</span>
                        <Button variant="outline" size="sm">Access</Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Local Ecosystem</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Local startup events</span>
                      <Button variant="outline" size="sm">Find</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Co-working spaces</span>
                      <Button variant="outline" size="sm">Book</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">Local investor networks</span>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracker" className="space-y-6">
          {/* Progress Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round((completedTasks.size / (actionPlans[selectedStage]?.phases?.reduce((acc, phase) => acc + phase.tasks.length, 0) || 1)) * 100)}%
                </div>
                <p className="text-sm text-blue-700">Overall Progress</p>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{completedTasks.size}</div>
                <p className="text-sm text-green-700">Tasks Completed</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(actionPlans[selectedStage]?.phases?.reduce((acc, phase) => acc + phase.tasks.length, 0) || 0) - completedTasks.size}
                </div>
                <p className="text-sm text-purple-700">Tasks Remaining</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {actionPlans[selectedStage]?.phases?.length || 0}
                </div>
                <p className="text-sm text-orange-700">Active Phases</p>
              </CardContent>
            </Card>
          </div>

          {/* Phase Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Phase-wise Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {actionPlans[selectedStage]?.phases?.map((phase, phaseIndex) => {
                  const phaseTasks = phase.tasks.map((_, taskIndex) => `${selectedStage}-${phaseIndex}-${taskIndex}`);
                  const completedInPhase = phaseTasks.filter(taskId => completedTasks.has(taskId)).length;
                  const progressPercent = (completedInPhase / phaseTasks.length) * 100;
                  
                  return (
                    <div key={phaseIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{phase.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {completedInPhase} / {phaseTasks.length}
                        </span>
                      </div>
                      <Progress value={progressPercent} className="w-full" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Complete Current Phase</h4>
                    <p className="text-sm text-muted-foreground">Finish all tasks in the current phase</p>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Achieve Key Metrics</h4>
                    <p className="text-sm text-muted-foreground">Hit the targets for your sector</p>
                  </div>
                  <Badge variant="secondary">Upcoming</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <h4 className="font-medium">Funding Readiness</h4>
                    <p className="text-sm text-muted-foreground">Prepare for next funding round</p>
                  </div>
                  <Badge variant="outline">Future</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dock />
    </div>
  );
}