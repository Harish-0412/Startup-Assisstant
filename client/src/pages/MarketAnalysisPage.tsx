import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dock } from '@/components/ui/Dock';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function MarketAnalysisPage() {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('funding');

  // Comprehensive market data
  const stateData = {
    'Karnataka': {
      name: 'Karnataka',
      capital: 'Bangalore',
      totalStartups: 4200,
      totalFunding: 28500,
      unicorns: 18,
      ecosystem: 'Tier-1',
      keyStrengths: ['Tech Hub', 'VC Presence', 'Talent Pool', 'Government Support'],
      topSectors: ['SaaS', 'Fintech', 'Deeptech', 'Healthtech'],
      fundingGrowth: 15.2,
      startupDensity: 68.5,
      avgTicketSize: 12.8,
      successRate: 23.4
    },
    'Maharashtra': {
      name: 'Maharashtra',
      capital: 'Mumbai',
      totalStartups: 3800,
      totalFunding: 24200,
      unicorns: 15,
      ecosystem: 'Tier-1',
      keyStrengths: ['Financial Capital', 'Corporate HQ', 'Infrastructure', 'Angel Networks'],
      topSectors: ['Fintech', 'D2C', 'Mediatech', 'Logistics'],
      fundingGrowth: 12.8,
      startupDensity: 52.3,
      avgTicketSize: 15.2,
      successRate: 21.7
    },
    'Delhi': {
      name: 'Delhi NCR',
      capital: 'New Delhi',
      totalStartups: 3200,
      totalFunding: 19800,
      unicorns: 12,
      ecosystem: 'Tier-1',
      keyStrengths: ['Government Support', 'Policy Hub', 'Large Market', 'Connectivity'],
      topSectors: ['Edtech', 'E-commerce', 'Healthtech', 'Agritech'],
      fundingGrowth: 18.5,
      startupDensity: 45.2,
      avgTicketSize: 11.5,
      successRate: 19.8
    },
    'Tamil Nadu': {
      name: 'Tamil Nadu',
      capital: 'Chennai',
      totalStartups: 1850,
      totalFunding: 8900,
      unicorns: 4,
      ecosystem: 'Tier-2',
      keyStrengths: ['Manufacturing Hub', 'Auto Sector', 'Port Access', 'Education'],
      topSectors: ['Deeptech', 'Manufacturing', 'Healthtech', 'Agritech'],
      fundingGrowth: 22.3,
      startupDensity: 28.7,
      avgTicketSize: 8.2,
      successRate: 18.5
    },
    'Telangana': {
      name: 'Telangana',
      capital: 'Hyderabad',
      totalStartups: 1650,
      totalFunding: 7200,
      unicorns: 3,
      ecosystem: 'Tier-2',
      keyStrengths: ['T-Hub', 'Pharma Hub', 'IT Corridor', 'Cost Advantage'],
      topSectors: ['Healthtech', 'Pharmatech', 'SaaS', 'Agritech'],
      fundingGrowth: 28.7,
      startupDensity: 35.4,
      avgTicketSize: 6.8,
      successRate: 20.2
    },
    'Andhra Pradesh': {
      name: 'Andhra Pradesh',
      capital: 'Amaravati',
      totalStartups: 980,
      totalFunding: 3200,
      unicorns: 1,
      ecosystem: 'Emerging',
      keyStrengths: ['Coastal Access', 'Agriculture', 'Renewable Energy', 'Government Push'],
      topSectors: ['Agritech', 'Renewable Energy', 'Aquaculture', 'Logistics'],
      fundingGrowth: 35.2,
      startupDensity: 18.9,
      avgTicketSize: 4.2,
      successRate: 16.8
    },
    'Kerala': {
      name: 'Kerala',
      capital: 'Thiruvananthapuram',
      totalStartups: 750,
      totalFunding: 2100,
      unicorns: 0,
      ecosystem: 'Emerging',
      keyStrengths: ['High Literacy', 'IT Parks', 'Tourism', 'Spices & Marine'],
      topSectors: ['Tourism Tech', 'Spice Tech', 'Marine Tech', 'Edtech'],
      fundingGrowth: 42.1,
      startupDensity: 22.1,
      avgTicketSize: 3.8,
      successRate: 15.2
    }
  };

  const sectorData = {
    'Fintech': {
      marketSize: 62000,
      growth: 22,
      startups: 2100,
      funding2024: 2800,
      keyPlayers: ['Paytm', 'Razorpay', 'CRED', 'Groww'],
      trends: ['UPI Growth', 'Neo Banking', 'Embedded Finance', 'Crypto Regulation'],
      challenges: ['Regulatory Compliance', 'Competition', 'Customer Acquisition'],
      opportunities: ['Rural Penetration', 'SME Lending', 'Wealth Management']
    },
    'SaaS': {
      marketSize: 15200,
      growth: 28,
      startups: 1800,
      funding2024: 1900,
      keyPlayers: ['Freshworks', 'Zoho', 'Chargebee', 'Postman'],
      trends: ['Vertical SaaS', 'AI Integration', 'Global Expansion', 'API Economy'],
      challenges: ['Price Sensitivity', 'Global Competition', 'Talent Shortage'],
      opportunities: ['SMB Market', 'Industry Specific', 'International Markets']
    },
    'Healthtech': {
      marketSize: 25000,
      growth: 25,
      startups: 1200,
      funding2024: 1200,
      keyPlayers: ['Practo', '1mg', 'PharmEasy', 'Portea'],
      trends: ['Telemedicine', 'AI Diagnostics', 'Preventive Care', 'Mental Health'],
      challenges: ['Regulatory Hurdles', 'Doctor Adoption', 'Data Privacy'],
      opportunities: ['Tier-2/3 Cities', 'Chronic Care', 'Elderly Care']
    },
    'Edtech': {
      marketSize: 18000,
      growth: 20,
      startups: 1500,
      funding2024: 800,
      keyPlayers: ['Byjus', 'Unacademy', 'Vedantu', 'UpGrad'],
      trends: ['Personalized Learning', 'Skill Development', 'Corporate Training', 'Regional Content'],
      challenges: ['High CAC', 'Low Retention', 'Regulatory Changes'],
      opportunities: ['Professional Upskilling', 'K-12 Supplementary', 'Test Prep']
    },
    'Agritech': {
      marketSize: 12000,
      growth: 18,
      startups: 800,
      funding2024: 450,
      keyPlayers: ['Ninjacart', 'DeHaat', 'CropIn', 'AgroStar'],
      trends: ['Precision Agriculture', 'Supply Chain', 'Farm Advisory', 'Climate Tech'],
      challenges: ['Farmer Adoption', 'Rural Infrastructure', 'Seasonal Dependency'],
      opportunities: ['Food Processing', 'Export Markets', 'Organic Farming']
    },
    'D2C': {
      marketSize: 20000,
      growth: 24,
      startups: 2500,
      funding2024: 1100,
      keyPlayers: ['Mamaearth', 'Boat', 'Lenskart', 'Sugar Cosmetics'],
      trends: ['Brand Building', 'Omnichannel', 'Sustainability', 'Social Commerce'],
      challenges: ['High CAC', 'Inventory Management', 'Competition'],
      opportunities: ['Tier-2/3 Markets', 'Export', 'Private Label']
    },
    'Deeptech': {
      marketSize: 8000,
      growth: 30,
      startups: 600,
      funding2024: 650,
      keyPlayers: ['Ola Electric', 'Agnikul', 'SigTuple', 'Niramai'],
      trends: ['AI/ML', 'Robotics', 'Space Tech', 'Quantum Computing'],
      challenges: ['Long Development', 'High Capital', 'Talent Shortage'],
      opportunities: ['Defense', 'Space', 'Manufacturing', 'Research Commercialization']
    }
  };

  // Historical data for charts (2020-2024)
  const historicalData = [
    { year: '2020', funding: 11300, startups: 8900, deals: 1200, valuation: 87 },
    { year: '2021', funding: 24300, startups: 12400, deals: 1583, valuation: 165 },
    { year: '2022', funding: 25700, startups: 14200, deals: 1681, valuation: 180 },
    { year: '2023', funding: 8500, startups: 15800, deals: 956, valuation: 95 },
    { year: '2024', funding: 11300, startups: 17200, deals: 1124, valuation: 118 }
  ];

  const sectorFundingData = [
    { year: '2020', Fintech: 2100, SaaS: 800, Healthtech: 600, Edtech: 1200, Agritech: 200, D2C: 400, Deeptech: 300 },
    { year: '2021', Fintech: 4200, SaaS: 1800, Healthtech: 1100, Edtech: 4100, Agritech: 500, D2C: 1200, Deeptech: 600 },
    { year: '2022', Fintech: 5100, SaaS: 2200, Healthtech: 1400, Edtech: 2800, Agritech: 650, D2C: 1800, Deeptech: 800 },
    { year: '2023', Fintech: 2200, SaaS: 1200, Healthtech: 800, Edtech: 600, Agritech: 300, D2C: 700, Deeptech: 400 },
    { year: '2024', Fintech: 2800, SaaS: 1900, Healthtech: 1200, Edtech: 800, Agritech: 450, D2C: 1100, Deeptech: 650 }
  ];

  const stateFundingData = [
    { state: 'Karnataka', funding: 28500, startups: 4200, growth: 15.2 },
    { state: 'Maharashtra', funding: 24200, startups: 3800, growth: 12.8 },
    { state: 'Delhi NCR', funding: 19800, startups: 3200, growth: 18.5 },
    { state: 'Tamil Nadu', funding: 8900, startups: 1850, growth: 22.3 },
    { state: 'Telangana', funding: 7200, startups: 1650, growth: 28.7 },
    { state: 'Andhra Pradesh', funding: 3200, startups: 980, growth: 35.2 },
    { state: 'Kerala', funding: 2100, startups: 750, growth: 42.1 }
  ];

  const filteredData = useMemo(() => {
    if (selectedState === 'all') return stateFundingData;
    return stateFundingData.filter(item => item.state.toLowerCase().includes(selectedState.toLowerCase()));
  }, [selectedState]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">📊 Market Analysis & Intelligence</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Comprehensive startup ecosystem analysis across Indian states and sectors (2020-2024)
        </p>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="Karnataka">Karnataka</SelectItem>
              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
              <SelectItem value="Delhi">Delhi NCR</SelectItem>
              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              <SelectItem value="Telangana">Telangana</SelectItem>
              <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
              <SelectItem value="Kerala">Kerala</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="Fintech">Fintech</SelectItem>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="Healthtech">Healthtech</SelectItem>
              <SelectItem value="Edtech">Edtech</SelectItem>
              <SelectItem value="Agritech">Agritech</SelectItem>
              <SelectItem value="D2C">D2C</SelectItem>
              <SelectItem value="Deeptech">Deeptech</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="funding">Funding Analysis</SelectItem>
              <SelectItem value="growth">Growth Trends</SelectItem>
              <SelectItem value="ecosystem">Ecosystem Health</SelectItem>
              <SelectItem value="opportunities">Opportunities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">📈 Overview</TabsTrigger>
          <TabsTrigger value="states">🗺️ States</TabsTrigger>
          <TabsTrigger value="sectors">🏭 Sectors</TabsTrigger>
          <TabsTrigger value="trends">📊 Trends</TabsTrigger>
          <TabsTrigger value="insights">💡 Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">₹94,800 Cr</div>
                <p className="text-sm text-blue-700">Total Funding (2024)</p>
                <Badge variant="outline" className="mt-2">+33% YoY</Badge>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">17,200+</div>
                <p className="text-sm text-green-700">Active Startups</p>
                <Badge variant="outline" className="mt-2">+8.9% YoY</Badge>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">108</div>
                <p className="text-sm text-purple-700">Unicorns</p>
                <Badge variant="outline" className="mt-2">+8 in 2024</Badge>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-orange-50/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">1,124</div>
                <p className="text-sm text-orange-700">Funding Deals</p>
                <Badge variant="outline" className="mt-2">+17.6% YoY</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding Trends (2020-2024)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`₹${value} Cr`, name]} />
                    <Legend />
                    <Line type="monotone" dataKey="funding" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State-wise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stateFundingData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ state, percent }) => `${state} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="funding"
                    >
                      {stateFundingData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`₹${value} Cr`, 'Funding']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          {/* State Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.values(stateData).map((state) => (
              <Card key={state.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {state.name}
                    <Badge variant={state.ecosystem === 'Tier-1' ? 'default' : state.ecosystem === 'Tier-2' ? 'secondary' : 'outline'}>
                      {state.ecosystem}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Total Startups</p>
                      <p className="text-2xl font-bold text-blue-600">{state.totalStartups.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Funding</p>
                      <p className="text-2xl font-bold text-green-600">₹{state.totalFunding.toLocaleString()} Cr</p>
                    </div>
                    <div>
                      <p className="font-medium">Unicorns</p>
                      <p className="text-xl font-bold text-purple-600">{state.unicorns}</p>
                    </div>
                    <div>
                      <p className="font-medium">Growth Rate</p>
                      <p className="text-xl font-bold text-orange-600">{state.fundingGrowth}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Key Strengths</p>
                    <div className="flex flex-wrap gap-1">
                      {state.keyStrengths.map((strength, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{strength}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Top Sectors</p>
                    <div className="flex flex-wrap gap-1">
                      {state.topSectors.map((sector, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{sector}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* State Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>State-wise Funding & Growth Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stateFundingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="funding" fill="#8884d8" name="Funding (₹ Cr)" />
                  <Bar yAxisId="right" dataKey="growth" fill="#82ca9d" name="Growth Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          {/* Sector Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(sectorData).map(([sectorName, sector]) => (
              <Card key={sectorName} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {sectorName}
                    <Badge variant="default">{sector.growth}% CAGR</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Market Size</p>
                      <p className="text-xl font-bold text-blue-600">₹{sector.marketSize.toLocaleString()} Cr</p>
                    </div>
                    <div>
                      <p className="font-medium">2024 Funding</p>
                      <p className="text-xl font-bold text-green-600">₹{sector.funding2024} Cr</p>
                    </div>
                    <div>
                      <p className="font-medium">Active Startups</p>
                      <p className="text-lg font-bold text-purple-600">{sector.startups.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Growth Rate</p>
                      <p className="text-lg font-bold text-orange-600">{sector.growth}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Key Players</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.keyPlayers.map((player, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{player}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Key Trends</p>
                    <div className="flex flex-wrap gap-1">
                      {sector.trends.slice(0, 3).map((trend, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{trend}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium mb-2">Top Opportunities</p>
                    <ul className="text-sm space-y-1">
                      {sector.opportunities.slice(0, 2).map((opp, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sector Funding Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Sector-wise Funding Trends (2020-2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={sectorFundingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`₹${value} Cr`, name]} />
                  <Legend />
                  <Area type="monotone" dataKey="Fintech" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="SaaS" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="Healthtech" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  <Area type="monotone" dataKey="Edtech" stackId="1" stroke="#ff7300" fill="#ff7300" />
                  <Area type="monotone" dataKey="D2C" stackId="1" stroke="#00ff00" fill="#00ff00" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Market Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Startup Count Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="startups" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deal Count Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deals" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-green-800">🚀 Growth Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Digital adoption acceleration</li>
                  <li>• Government policy support</li>
                  <li>• Tier-2/3 city emergence</li>
                  <li>• Global market access</li>
                  <li>• Talent pool expansion</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="text-orange-800">⚠️ Key Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Funding winter impact</li>
                  <li>• Profitability pressure</li>
                  <li>• Regulatory compliance</li>
                  <li>• Talent cost inflation</li>
                  <li>• Market competition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-blue-800">💡 Future Outlook</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• AI/ML integration boom</li>
                  <li>• Sustainability focus</li>
                  <li>• B2B SaaS growth</li>
                  <li>• Rural market penetration</li>
                  <li>• Export opportunities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Strategic Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Investment Hotspots</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-600">Karnataka - Tech Leadership</h4>
                    <p className="text-sm text-muted-foreground">Highest startup density, strong VC presence, global tech companies</p>
                    <Badge variant="outline" className="mt-1">Best for: SaaS, Deeptech</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-600">Maharashtra - Financial Hub</h4>
                    <p className="text-sm text-muted-foreground">Corporate headquarters, strong fintech ecosystem, angel networks</p>
                    <Badge variant="outline" className="mt-1">Best for: Fintech, D2C</Badge>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-purple-600">Telangana - Emerging Star</h4>
                    <p className="text-sm text-muted-foreground">Highest growth rate, government support, cost advantages</p>
                    <Badge variant="outline" className="mt-1">Best for: Healthtech, Agritech</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📈 Sector Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-green-600">Fintech - Market Leader</h4>
                    <p className="text-sm text-muted-foreground">Largest market, strong growth, regulatory clarity improving</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">₹62,000 Cr Market</Badge>
                      <Badge variant="outline">22% Growth</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-blue-600">SaaS - Global Potential</h4>
                    <p className="text-sm text-muted-foreground">High growth, global market access, strong talent pool</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">₹15,200 Cr Market</Badge>
                      <Badge variant="outline">28% Growth</Badge>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-purple-600">Deeptech - Future Ready</h4>
                    <p className="text-sm text-muted-foreground">Highest growth potential, government support, global demand</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">₹8,000 Cr Market</Badge>
                      <Badge variant="outline">30% Growth</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-600">For Early Stage Startups</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Focus on Tier-1 cities for initial traction</li>
                    <li>• Leverage government schemes and grants</li>
                    <li>• Build in high-growth sectors (SaaS, Fintech)</li>
                    <li>• Consider Bangalore/Mumbai for VC access</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-600">For Growth Stage</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Expand to Tier-2 cities for cost optimization</li>
                    <li>• Focus on profitability and unit economics</li>
                    <li>• Consider international expansion</li>
                    <li>• Build strategic partnerships</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-600">For Investors</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Focus on sustainable business models</li>
                    <li>• Consider emerging states for better valuations</li>
                    <li>• Invest in deeptech and AI/ML startups</li>
                    <li>• Look for export-oriented businesses</li>
                  </ul>
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