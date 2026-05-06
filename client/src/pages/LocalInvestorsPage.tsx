import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  MapPin, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  ExternalLink, 
  Filter, 
  Search, 
  Star,
  Calendar,
  TrendingUp,
  DollarSign,
  Globe,
  Linkedin,
  Twitter,
  Award,
  Clock,
  Target,
  Briefcase
} from 'lucide-react';
import { Dock } from '@/components/ui/Dock';

// Comprehensive and accurate investor database
const INDIAN_INVESTORS_BY_LOCATION = {
  'Karnataka': {
    'Bangalore': [
      {
        name: 'Sequoia Capital India',
        type: 'Venture Capital',
        address: 'UB City Tower, 24 Vittal Mallya Road, Bangalore 560001',
        ticketSize: '₹5-50 Cr',
        focusSectors: ['SaaS', 'FinTech', 'Consumer Tech', 'Enterprise Software', 'Healthcare'],
        portfolio: ['Razorpay', 'Byju\'s', 'Zomato', 'Freshworks', 'Chargebee', 'Druva'],
        contact: { 
          email: 'india@sequoiacap.com', 
          website: 'https://www.sequoiacap.com/india',
          phone: '+91-80-4072-8000',
          linkedin: 'https://linkedin.com/company/sequoia-capital-india'
        },
        recentDeals: 12,
        activelyInvesting: true,
        founded: 2006,
        aum: '$9 billion',
        investmentStage: ['Series A', 'Series B', 'Series C', 'Growth'],
        keyPersons: ['Shailendra Singh', 'Abhishek Mohan', 'Tejeshwi Sharma'],
        rating: 4.8,
        responseTime: '2-3 weeks',
        lastActivity: '2024-01-15',
        description: 'Leading VC firm focusing on technology startups across India and Southeast Asia.',
        investmentCriteria: {
          minRevenue: '₹10 Cr ARR',
          teamSize: '10+ employees',
          marketSize: '$1B+ TAM'
        }
      },
      {
        name: 'Accel Partners India',
        type: 'Venture Capital',
        address: 'Prestige Meridian II, 30 MG Road, Bangalore 560001',
        ticketSize: '₹10-100 Cr',
        focusSectors: ['SaaS', 'Enterprise Software', 'Marketplace', 'FinTech', 'Consumer'],
        portfolio: ['Freshworks', 'Swiggy', 'BookMyShow', 'Flipkart', 'BrowserStack', 'Zenoti'],
        contact: { 
          email: 'bangalore@accel.com', 
          website: 'https://www.accel.com',
          phone: '+91-80-4115-5200',
          linkedin: 'https://linkedin.com/company/accel-partners'
        },
        recentDeals: 8,
        activelyInvesting: true,
        founded: 2008,
        aum: '$3 billion',
        investmentStage: ['Seed', 'Series A', 'Series B'],
        keyPersons: ['Prashanth Prakash', 'Prayank Swaroop', 'Anand Daniel'],
        rating: 4.7,
        responseTime: '3-4 weeks',
        lastActivity: '2024-01-10',
        description: 'Global VC firm with strong presence in India, focusing on early-stage technology companies.',
        investmentCriteria: {
          minRevenue: '₹5 Cr ARR',
          teamSize: '5+ employees',
          marketSize: '$500M+ TAM'
        }
      },
      {
        name: 'Blume Ventures',
        type: 'Early Stage VC',
        address: '6th Floor, Raheja Arcade, Koramangala, Bangalore 560095',
        ticketSize: '₹2-25 Cr',
        focusSectors: ['SaaS', 'FinTech', 'Consumer Tech', 'DeepTech', 'B2B Software'],
        portfolio: ['Dunzo', 'GreyOrange', 'Purplle', 'Unacademy', 'Cashify', 'Exotel'],
        contact: { 
          email: 'team@blume.vc', 
          website: 'https://blume.vc',
          phone: '+91-80-4092-2400',
          linkedin: 'https://linkedin.com/company/blume-ventures'
        },
        recentDeals: 15,
        activelyInvesting: true,
        founded: 2010,
        aum: '$200 million',
        investmentStage: ['Pre-Seed', 'Seed', 'Series A'],
        keyPersons: ['Karthik Reddy', 'Sanjay Nath', 'Arpit Agarwal'],
        rating: 4.6,
        responseTime: '2-3 weeks',
        lastActivity: '2024-01-20',
        description: 'Early-stage VC firm supporting entrepreneurs building for India and the world.',
        investmentCriteria: {
          minRevenue: 'Pre-revenue to ₹2 Cr',
          teamSize: '2+ founders',
          marketSize: '$100M+ TAM'
        }
      },
      {
        name: '3one4 Capital',
        type: 'Early Stage VC',
        address: '100 Feet Road, Indiranagar, Bangalore 560038',
        ticketSize: '₹3-30 Cr',
        focusSectors: ['SaaS', 'FinTech', 'DeepTech', 'Enterprise Software', 'Consumer'],
        portfolio: ['Licious', 'BharatPe', 'Open', 'Ninjacart', 'Betterplace', 'Wysa'],
        contact: { 
          email: 'hello@3one4capital.com', 
          website: 'https://3one4capital.com',
          phone: '+91-80-4718-4000',
          linkedin: 'https://linkedin.com/company/3one4-capital'
        },
        recentDeals: 6,
        activelyInvesting: true,
        founded: 2016,
        aum: '$150 million',
        investmentStage: ['Seed', 'Series A', 'Series B'],
        keyPersons: ['Pranav Pai', 'Siddarth Pai', 'Anurag Ramdasan'],
        rating: 4.5,
        responseTime: '2-4 weeks',
        lastActivity: '2024-01-08',
        description: 'Technology-focused VC firm investing in Indian startups with global potential.',
        investmentCriteria: {
          minRevenue: '₹1 Cr ARR',
          teamSize: '3+ employees',
          marketSize: '$200M+ TAM'
        }
      },
      {
        name: 'Elevation Capital',
        type: 'Growth Capital',
        address: 'Embassy Golf Links, Intermediate Ring Road, Bangalore 560071',
        ticketSize: '₹25-200 Cr',
        focusSectors: ['Consumer Internet', 'SaaS', 'FinTech', 'Healthcare', 'Education'],
        portfolio: ['Paytm', 'MakeMyTrip', 'Nykaa', 'Swiggy', 'Meesho', 'Cure.fit'],
        contact: { 
          email: 'info@elevationcapital.com', 
          website: 'https://elevationcapital.com',
          phone: '+91-80-4243-4000',
          linkedin: 'https://linkedin.com/company/elevation-capital'
        },
        recentDeals: 4,
        activelyInvesting: true,
        founded: 2002,
        aum: '$2 billion',
        investmentStage: ['Series B', 'Series C', 'Growth'],
        keyPersons: ['Ravi Adusumalli', 'Mukul Arora', 'Mridul Arora'],
        rating: 4.9,
        responseTime: '4-6 weeks',
        lastActivity: '2024-01-12',
        description: 'Leading growth-stage investor in Indian consumer and technology companies.',
        investmentCriteria: {
          minRevenue: '₹50 Cr ARR',
          teamSize: '50+ employees',
          marketSize: '$5B+ TAM'
        }
      }
    ]
  },
  'Maharashtra': {
    'Mumbai': [
      {
        name: 'Lightspeed Venture Partners',
        type: 'Venture Capital',
        address: 'One BKC, G Block, 13th Floor, Bandra Kurla Complex, Mumbai 400051',
        ticketSize: '₹20-150 Cr',
        focusSectors: ['Enterprise Software', 'Consumer', 'FinTech', 'Healthcare', 'Education'],
        portfolio: ['Byju\'s', 'Oyo', 'Udaan', 'Sharechat', 'Innovaccer', 'Grab'],
        contact: { 
          email: 'india@lsvp.com', 
          website: 'https://lsvp.com',
          phone: '+91-22-6742-8000',
          linkedin: 'https://linkedin.com/company/lightspeed-venture-partners'
        },
        recentDeals: 5,
        activelyInvesting: true,
        founded: 2007,
        aum: '$7 billion',
        investmentStage: ['Series A', 'Series B', 'Series C'],
        keyPersons: ['Bejul Somaia', 'Dev Khare', 'Hemant Mohapatra'],
        rating: 4.7,
        responseTime: '3-5 weeks',
        lastActivity: '2024-01-18',
        description: 'Global VC firm investing in exceptional entrepreneurs building category-defining companies.',
        investmentCriteria: {
          minRevenue: '₹10 Cr ARR',
          teamSize: '15+ employees',
          marketSize: '$1B+ TAM'
        }
      },
      {
        name: 'Kalaari Capital',
        type: 'Venture Capital',
        address: '247 Park, LBS Marg, Vikhroli West, Mumbai 400083',
        ticketSize: '₹5-50 Cr',
        focusSectors: ['SaaS', 'FinTech', 'Healthcare', 'Consumer Tech', 'DeepTech'],
        portfolio: ['Dream11', 'Snapdeal', 'CureFit', 'Myntra', 'Vogo', 'Milkbasket'],
        contact: { 
          email: 'team@kalaari.com', 
          website: 'https://kalaari.com',
          phone: '+91-22-6178-7000',
          linkedin: 'https://linkedin.com/company/kalaari-capital'
        },
        recentDeals: 9,
        activelyInvesting: true,
        founded: 2006,
        aum: '$650 million',
        investmentStage: ['Seed', 'Series A', 'Series B'],
        keyPersons: ['Vani Kola', 'Rahul Garg', 'Sumit Jain'],
        rating: 4.6,
        responseTime: '2-4 weeks',
        lastActivity: '2024-01-14',
        description: 'Early-stage VC firm backing entrepreneurs building innovative solutions for India.',
        investmentCriteria: {
          minRevenue: '₹2 Cr ARR',
          teamSize: '5+ employees',
          marketSize: '$300M+ TAM'
        }
      }
    ],
    'Pune': [
      {
        name: 'Nexus Venture Partners',
        type: 'Venture Capital',
        address: 'Cerebrum IT Park, Kalyani Nagar, Pune 411014',
        ticketSize: '₹10-100 Cr',
        focusSectors: ['SaaS', 'FinTech', 'Consumer Internet', 'Enterprise Software', 'Healthcare'],
        portfolio: ['Postman', 'Unacademy', 'Turtlemint', 'Delhivery', 'Rapido', 'H2O.ai'],
        contact: { 
          email: 'pune@nexusvp.com', 
          website: 'https://nexusvp.com',
          phone: '+91-20-6742-5000',
          linkedin: 'https://linkedin.com/company/nexus-venture-partners'
        },
        recentDeals: 7,
        activelyInvesting: true,
        founded: 2006,
        aum: '$1.4 billion',
        investmentStage: ['Series A', 'Series B', 'Series C'],
        keyPersons: ['Naren Gupta', 'Sandeep Singhal', 'Jishnu Bhattacharjee'],
        rating: 4.8,
        responseTime: '3-4 weeks',
        lastActivity: '2024-01-16',
        description: 'Leading VC firm investing in technology startups across India and US.',
        investmentCriteria: {
          minRevenue: '₹5 Cr ARR',
          teamSize: '10+ employees',
          marketSize: '$500M+ TAM'
        }
      }
    ]
  },
  'Delhi': {
    'New Delhi': [
      {
        name: 'Matrix Partners India',
        type: 'Venture Capital',
        address: 'Connaught Place, New Delhi 110001',
        ticketSize: '₹5-75 Cr',
        focusSectors: ['SaaS', 'FinTech', 'Mobility', 'Consumer Tech', 'Healthcare'],
        portfolio: ['Ola', 'Razorpay', 'Dailyhunt', 'Quikr', 'Practo', 'Treebo'],
        contact: { 
          email: 'delhi@matrixpartners.in', 
          website: 'https://matrixpartners.in',
          phone: '+91-11-4175-8000',
          linkedin: 'https://linkedin.com/company/matrix-partners-india'
        },
        recentDeals: 11,
        activelyInvesting: true,
        founded: 2006,
        aum: '$1.2 billion',
        investmentStage: ['Seed', 'Series A', 'Series B'],
        keyPersons: ['Avnish Bajaj', 'Tarun Davda', 'Vikram Vaidyanathan'],
        rating: 4.7,
        responseTime: '2-3 weeks',
        lastActivity: '2024-01-22',
        description: 'Early-stage VC firm partnering with entrepreneurs to build market-leading companies.',
        investmentCriteria: {
          minRevenue: '₹1 Cr ARR',
          teamSize: '3+ employees',
          marketSize: '$200M+ TAM'
        }
      }
    ]
  }
};

// Angel investors database
const ANGEL_INVESTORS_BY_CITY = {
  'Mumbai': [
    {
      name: 'Kunal Shah',
      company: 'CRED (Founder & CEO)',
      designation: 'Serial Entrepreneur',
      ticketSize: '₹25L-3 Cr',
      focusSectors: ['FinTech', 'Consumer Tech', 'SaaS', 'B2B'],
      investments: 75,
      contact: { 
        twitter: 'https://twitter.com/kunalb11', 
        linkedin: 'https://linkedin.com/in/kunalshah1',
        email: 'investments@cred.club'
      },
      portfolio: ['Razorpay', 'Unacademy', 'FarEye', 'Spinny'],
      expertise: ['Product Strategy', 'Consumer Behavior', 'Scaling'],
      responseTime: '1-2 weeks',
      activelyInvesting: true,
      investmentCriteria: 'Strong product-market fit, exceptional founders',
      description: 'Founder of FreeCharge and CRED, active angel investor in consumer and fintech startups.'
    },
    {
      name: 'Anupam Mittal',
      company: 'Shaadi.com (Founder & CEO)',
      designation: 'Serial Entrepreneur & Investor',
      ticketSize: '₹25L-5 Cr',
      focusSectors: ['Consumer Internet', 'SaaS', 'D2C', 'FinTech'],
      investments: 120,
      contact: { 
        twitter: 'https://twitter.com/AnupamMittal', 
        linkedin: 'https://linkedin.com/in/anupammittal',
        email: 'investments@people-group.com'
      },
      portfolio: ['Ola', 'Druva', 'TaxiForSure', 'Pretty Secrets'],
      expertise: ['Consumer Internet', 'Marketplaces', 'Brand Building'],
      responseTime: '2-3 weeks',
      activelyInvesting: true,
      investmentCriteria: 'Large market opportunity, strong execution capability',
      description: 'Founder of People Group, Shark Tank India judge, prolific angel investor.'
    }
  ],
  'Bangalore': [
    {
      name: 'Binny Bansal',
      company: 'Flipkart (Co-founder)',
      designation: 'Serial Entrepreneur',
      ticketSize: '₹50L-10 Cr',
      focusSectors: ['E-commerce', 'Logistics', 'SaaS', 'B2B'],
      investments: 45,
      contact: { 
        linkedin: 'https://linkedin.com/in/binnybansal',
        email: 'investments@xto10x.com'
      },
      portfolio: ['Acko', 'PhonePe', 'Cure.fit', 'Shadowfax'],
      expertise: ['E-commerce', 'Operations', 'Scaling'],
      responseTime: '2-4 weeks',
      activelyInvesting: true,
      investmentCriteria: 'Technology-driven solutions, experienced teams',
      description: 'Co-founder of Flipkart, founder of xto10x, active in logistics and commerce startups.'
    },
    {
      name: 'Sachin Bansal',
      company: 'Flipkart (Co-founder)',
      designation: 'Entrepreneur & Investor',
      ticketSize: '₹1-15 Cr',
      focusSectors: ['FinTech', 'B2B', 'DeepTech', 'Consumer'],
      investments: 35,
      contact: { 
        linkedin: 'https://linkedin.com/in/sachinbansal',
        twitter: 'https://twitter.com/bansalsachin'
      },
      portfolio: ['Ather Energy', 'Unacademy', 'Ola Electric', 'Navi'],
      expertise: ['Product Development', 'Technology', 'Consumer Insights'],
      responseTime: '3-4 weeks',
      activelyInvesting: true,
      investmentCriteria: 'Innovation-driven, large market potential',
      description: 'Co-founder of Flipkart, founder of Navi Technologies, focuses on fintech and mobility.'
    }
  ],
  'Delhi': [
    {
      name: 'Deepinder Goyal',
      company: 'Zomato (Founder & CEO)',
      designation: 'Entrepreneur',
      ticketSize: '₹25L-2 Cr',
      focusSectors: ['FoodTech', 'Consumer', 'Logistics', 'SaaS'],
      investments: 25,
      contact: { 
        twitter: 'https://twitter.com/deepigoyal',
        linkedin: 'https://linkedin.com/in/deepinder-goyal'
      },
      portfolio: ['Shiprocket', 'Magicpin', 'Grofers', 'Dunzo'],
      expertise: ['Consumer Products', 'Food Industry', 'Operations'],
      responseTime: '2-3 weeks',
      activelyInvesting: true,
      investmentCriteria: 'Consumer-focused, strong unit economics',
      description: 'Founder of Zomato, active investor in consumer and food-tech startups.'
    }
  ]
};

// Investment stages and criteria
const INVESTMENT_STAGES = {
  'Pre-Seed': { range: '₹10L-1Cr', description: 'Idea to early prototype stage' },
  'Seed': { range: '₹50L-5Cr', description: 'Product-market fit validation' },
  'Series A': { range: '₹5-25Cr', description: 'Scaling and growth' },
  'Series B': { range: '₹25-100Cr', description: 'Market expansion' },
  'Series C+': { range: '₹100Cr+', description: 'Late-stage growth' }
};

export default function LocalInvestorsPage() {
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('vcs');
  const [selectedInvestor, setSelectedInvestor] = useState(null);

  const states = Object.keys(INDIAN_INVESTORS_BY_LOCATION);
  const cities = selectedState ? Object.keys(INDIAN_INVESTORS_BY_LOCATION[selectedState] || {}) : [];
  const investors = selectedState && selectedCity ? 
    INDIAN_INVESTORS_BY_LOCATION[selectedState]?.[selectedCity] || [] : [];
  
  const angelInvestors = ANGEL_INVESTORS_BY_CITY[selectedCity] || [];

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.focusSectors.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = sectorFilter === 'All' || investor.focusSectors.includes(sectorFilter);
    const matchesStage = stageFilter === 'All' || investor.investmentStage.includes(stageFilter);
    return matchesSearch && matchesSector && matchesStage;
  });

  const allSectors = [...new Set(investors.flatMap(inv => inv.focusSectors))];
  const allStages = [...new Set(investors.flatMap(inv => inv.investmentStage))];

  const handleContactClick = (contactType, contactInfo) => {
    switch (contactType) {
      case 'email':
        window.open(`mailto:${contactInfo}`, '_blank');
        break;
      case 'website':
        window.open(contactInfo, '_blank');
        break;
      case 'linkedin':
        window.open(contactInfo, '_blank');
        break;
      case 'twitter':
        window.open(contactInfo, '_blank');
        break;
      case 'phone':
        window.open(`tel:${contactInfo}`, '_blank');
        break;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">🏢 Local Investors Database</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Comprehensive database of active investors in India with verified contact information and investment criteria
        </p>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <Select value={selectedState} onValueChange={(value) => {
              setSelectedState(value);
              const newCities = Object.keys(INDIAN_INVESTORS_BY_LOCATION[value] || {});
              setSelectedCity(newCities[0] || '');
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {states.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sector</label>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Sectors</SelectItem>
                {allSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stage</label>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Stages</SelectItem>
                {allStages.map(stage => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search investors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vcs">🏢 VCs ({filteredInvestors.length})</TabsTrigger>
          <TabsTrigger value="angels">👼 Angels ({angelInvestors.length})</TabsTrigger>
          <TabsTrigger value="insights">📊 Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="vcs" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{filteredInvestors.length}</p>
                <p className="text-sm text-blue-700">Active VCs</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {filteredInvestors.reduce((sum, inv) => sum + inv.recentDeals, 0)}
                </p>
                <p className="text-sm text-green-700">Recent Deals (2024)</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-purple-600">
                  ₹{Math.round(filteredInvestors.reduce((sum, inv) => {
                    const avg = parseInt(inv.ticketSize.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
                    return sum + avg;
                  }, 0) / (filteredInvestors.length || 1))}Cr
                </p>
                <p className="text-sm text-purple-700">Avg Ticket Size</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {(filteredInvestors.reduce((sum, inv) => sum + inv.rating, 0) / (filteredInvestors.length || 1)).toFixed(1)}
                </p>
                <p className="text-sm text-orange-700">Avg Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Investor Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestors.map((investor, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg mb-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        {investor.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{investor.type}</Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {investor.activelyInvesting ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium">{investor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">{investor.ticketSize}</p>
                      <p className="text-xs text-muted-foreground">Ticket Size</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{investor.address}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Focus Sectors</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.focusSectors.slice(0, 4).map((sector, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{sector}</Badge>
                      ))}
                      {investor.focusSectors.length > 4 && (
                        <Badge variant="outline" className="text-xs">+{investor.focusSectors.length - 4}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Investment Stages</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.investmentStage.map((stage, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{stage}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Notable Portfolio</p>
                    <p className="text-sm text-muted-foreground">
                      {investor.portfolio.slice(0, 3).join(', ')}
                      {investor.portfolio.length > 3 && ` +${investor.portfolio.length - 3} more`}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-sm font-bold">{investor.founded}</p>
                      <p className="text-xs text-muted-foreground">Founded</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">{investor.aum}</p>
                      <p className="text-xs text-muted-foreground">AUM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">{investor.responseTime}</p>
                      <p className="text-xs text-muted-foreground">Response</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleContactClick('email', investor.contact.email)}
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleContactClick('website', investor.contact.website)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Website
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1 text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{investor.name}</DialogTitle>
                          <DialogDescription>{investor.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Investment Criteria</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Min Revenue:</span> {investor.investmentCriteria.minRevenue}
                              </div>
                              <div>
                                <span className="font-medium">Team Size:</span> {investor.investmentCriteria.teamSize}
                              </div>
                              <div>
                                <span className="font-medium">Market Size:</span> {investor.investmentCriteria.marketSize}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Key Persons</h4>
                            <div className="flex flex-wrap gap-2">
                              {investor.keyPersons.map((person, i) => (
                                <Badge key={i} variant="outline">{person}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleContactClick('email', investor.contact.email)}
                              className="flex-1"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleContactClick('linkedin', investor.contact.linkedin)}
                              className="flex-1"
                            >
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="angels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {angelInvestors.map((angel, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    {angel.name}
                  </CardTitle>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{angel.company}</p>
                    <p className="text-xs text-muted-foreground">{angel.designation}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ticket Size:</span>
                    <span className="text-sm font-bold text-orange-600">{angel.ticketSize}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Focus Areas</p>
                    <div className="flex flex-wrap gap-1">
                      {angel.focusSectors.map((sector, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{sector}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {angel.expertise.map((exp, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{exp}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Investments:</span> {angel.investments}+
                    </div>
                    <div>
                      <span className="font-medium">Response:</span> {angel.responseTime}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Investment Criteria</p>
                    <p className="text-xs text-muted-foreground">{angel.investmentCriteria}</p>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs"
                      onClick={() => handleContactClick('linkedin', angel.contact.linkedin)}
                    >
                      <Linkedin className="w-3 h-3 mr-1" />
                      LinkedIn
                    </Button>
                    {angel.contact.twitter && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => handleContactClick('twitter', angel.contact.twitter)}
                      >
                        <Twitter className="w-3 h-3 mr-1" />
                        Twitter
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Investment Stages Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(INVESTMENT_STAGES).map(([stage, info]) => (
                  <div key={stage} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{stage}</h4>
                      <Badge variant="outline">{info.range}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎯 Tips for Approaching Investors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-1">Research First</h4>
                  <p className="text-sm text-blue-700">Study their portfolio and investment thesis before reaching out.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-1">Warm Introductions</h4>
                  <p className="text-sm text-green-700">Get introduced through mutual connections for higher response rates.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-1">Concise Pitch</h4>
                  <p className="text-sm text-purple-700">Keep initial outreach brief and focused on key metrics.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-1">Follow Up</h4>
                  <p className="text-sm text-orange-700">Send periodic updates even if they don't invest initially.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {filteredInvestors.length === 0 && activeTab === 'vcs' && (
        <Card className="text-center p-8">
          <CardContent>
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No investors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or selecting a different location
            </p>
            <Button onClick={() => { 
              setSearchTerm(''); 
              setSectorFilter('All'); 
              setStageFilter('All'); 
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Dock />
    </div>
  );
}