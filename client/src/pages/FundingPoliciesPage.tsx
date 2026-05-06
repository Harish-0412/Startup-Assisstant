import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { 
  FileText, 
  ExternalLink, 
  Calendar, 
  DollarSign, 
  Users, 
  Building, 
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  Download,
  Star,
  TrendingUp,
  Target,
  Award,
  Globe,
  BookOpen,
  Calculator,
  Briefcase,
  Shield
} from 'lucide-react';
import { Dock } from '@/components/ui/Dock';

// Comprehensive government funding schemes database
const GOVERNMENT_SCHEMES = {
  central: [
    {
      id: 'sisfs',
      name: 'Startup India Seed Fund Scheme (SISFS)',
      authority: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
      fundingAmount: '₹20 Lakh - ₹5 Crore',
      totalAllocation: '₹945 Crore',
      stage: 'Seed/Early Stage',
      sectors: ['All sectors'],
      eligibility: [
        'DPIIT recognized startup (Certificate of Recognition)',
        'Incorporated within 2 years from application date',
        'Annual turnover less than ₹25 Crore in any financial year',
        'Working on innovation, development, deployment of new products/services',
        'Scalable business model with high potential of employment generation'
      ],
      benefits: [
        'Proof of concept funding: Up to ₹20 Lakh (70% grant + 30% equity)',
        'Prototype development: Up to ₹50 Lakh (50% grant + 50% equity)', 
        'Market entry support: Up to ₹5 Crore (100% equity)',
        'Mentorship and incubation support',
        'Access to government procurement opportunities'
      ],
      applicationProcess: [
        'Register on Startup India portal (startupindia.gov.in)',
        'Submit detailed business plan with financial projections',
        'Apply through eligible incubators empaneled with DPIIT',
        'Due diligence by incubator and expert committee',
        'Final approval by Experts Advisory Committee (EAC)',
        'Funding agreement execution and disbursement'
      ],
      timeline: '3-6 months',
      website: 'https://www.startupindia.gov.in/content/sih/en/sis-fund.html',
      applicationLink: 'https://www.startupindia.gov.in/content/sih/en/sis-fund/apply-now.html',
      guidelinesLink: 'https://www.startupindia.gov.in/content/dam/invest-india/Templates/public/SISFS%20Guidelines.pdf',
      contact: {
        email: 'startupindia-dipp@gov.in',
        phone: '1800-115-565',
        address: 'Udyog Bhawan, New Delhi 110011'
      },
      lastUpdated: '2024-01-15',
      status: 'Active',
      successRate: 15,
      avgProcessingTime: '4.5 months',
      totalStartupsFunded: 750,
      pros: [
        'No collateral or guarantee required',
        'Combination of grant and equity funding',
        'Access to mentorship and incubation',
        'Government backing increases credibility',
        'Covers multiple stages from PoC to market entry'
      ],
      cons: [
        'Requires DPIIT recognition (can take 2-3 months)',
        'Must apply through empaneled incubators only',
        'Equity dilution in later stages',
        'Lengthy approval process',
        'Limited to Indian startups only'
      ],
      tips: [
        'Get DPIIT recognition before applying',
        'Choose the right incubator partner',
        'Prepare detailed financial projections',
        'Highlight innovation and scalability',
        'Show clear market potential and job creation'
      ]
    },
    {
      id: 'pmmy',
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      authority: 'Ministry of Finance, Government of India',
      fundingAmount: '₹10 Lakh - ₹10 Lakh',
      totalAllocation: '₹3,21,000 Crore (FY 2024-25)',
      stage: 'Micro enterprises',
      sectors: ['Manufacturing', 'Trading', 'Services', 'Agriculture allied activities'],
      eligibility: [
        'Non-corporate, non-farm small/micro enterprises',
        'Loan requirement up to ₹10 lakh for income generating activities',
        'Not defaulter to any bank or financial institution',
        'Should have a viable business plan',
        'Age: 18-65 years for individual borrowers'
      ],
      benefits: [
        'Shishu: Up to ₹50,000 (for starting businesses)',
        'Kishore: ₹50,001 to ₹5 Lakh (for established businesses)',
        'Tarun: ₹5,00,001 to ₹10 Lakh (for growth stage)',
        'No collateral/guarantee required',
        'Mudra Card facility for working capital',
        'Interest rate: 8-12% per annum'
      ],
      applicationProcess: [
        'Approach any bank, NBFC, or MFI',
        'Submit application with business plan',
        'Provide KYC documents and business proof',
        'Bank evaluation and credit assessment',
        'Loan sanction and agreement signing',
        'Disbursement in account'
      ],
      timeline: '15-30 days',
      website: 'https://www.mudra.org.in',
      applicationLink: 'https://www.mudra.org.in/Default/Download/ApplicationForm',
      guidelinesLink: 'https://www.mudra.org.in/Default/Download/Guidelines',
      contact: {
        email: 'info@mudra.org.in',
        phone: '1800-180-1111',
        address: 'Mudra House, C-11, G-Block, Bandra Kurla Complex, Mumbai 400051'
      },
      lastUpdated: '2024-01-20',
      status: 'Active',
      successRate: 85,
      avgProcessingTime: '20 days',
      totalStartupsFunded: 38500000,
      pros: [
        'No collateral required',
        'Quick processing (15-30 days)',
        'Available at all banks and NBFCs',
        'Covers wide range of business activities',
        'Mudra Card for easy working capital access'
      ],
      cons: [
        'Limited to ₹10 lakh maximum',
        'Interest rates vary by lender (8-12%)',
        'Requires existing business or clear business plan',
        'Not suitable for high-tech startups',
        'Personal guarantee may be required'
      ],
      tips: [
        'Prepare detailed business plan with cash flows',
        'Approach multiple lenders for best rates',
        'Maintain good credit score',
        'Keep all business documents ready',
        'Consider starting with Shishu category'
      ]
    },
    {
      id: 'cgtmse',
      name: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
      authority: 'Ministry of MSME, Government of India',
      fundingAmount: '₹10 Lakh - ₹5 Crore',
      totalAllocation: '₹7,500 Crore corpus',
      stage: 'MSME (Micro, Small & Medium Enterprises)',
      sectors: ['Manufacturing', 'Services', 'Trading (limited)'],
      eligibility: [
        'New/existing MSME unit as per MSMED Act 2006',
        'Credit facility up to ₹5 Crore without collateral',
        'Promoter should contribute minimum 15-25% of project cost',
        'Unit should be engaged in manufacturing or service activities',
        'Should not be defaulter to any bank'
      ],
      benefits: [
        'Collateral-free loans up to ₹5 Crore',
        '75% guarantee coverage for loans up to ₹5 Lakh',
        '80% guarantee coverage for loans above ₹5 Lakh',
        '85% guarantee for loans to women entrepreneurs',
        'Reduced interest rates due to guarantee',
        'Faster loan processing by banks'
      ],
      applicationProcess: [
        'Apply through CGTMSE member lending institutions',
        'Submit detailed project report with financials',
        'Bank conducts technical and financial evaluation',
        'Bank sanctions loan with CGTMSE guarantee',
        'CGTMSE processes guarantee application',
        'Loan disbursement after guarantee approval'
      ],
      timeline: '30-45 days',
      website: 'https://www.cgtmse.in',
      applicationLink: 'https://www.cgtmse.in/home/vs.aspx?pageid=7',
      guidelinesLink: 'https://www.cgtmse.in/Documents/Operational-Guidelines.pdf',
      contact: {
        email: 'cgtmse@sidbi.in',
        phone: '022-2572-5600',
        address: 'SIDBI Tower, 15 Ashok Marg, Lucknow 226001'
      },
      lastUpdated: '2024-01-10',
      status: 'Active',
      successRate: 70,
      avgProcessingTime: '35 days',
      totalStartupsFunded: 4500000,
      pros: [
        'No collateral up to ₹5 Crore',
        'High guarantee coverage (75-85%)',
        'Available through all major banks',
        'Covers both manufacturing and services',
        'Special benefits for women entrepreneurs'
      ],
      cons: [
        'Requires 15-25% promoter contribution',
        'Limited to MSME definition limits',
        'Guarantee fee payable (0.5-1.5% annually)',
        'Bank still evaluates creditworthiness',
        'Processing can be slower than direct loans'
      ],
      tips: [
        'Ensure MSME registration before applying',
        'Prepare comprehensive project report',
        'Approach CGTMSE member institutions only',
        'Highlight job creation potential',
        'Maintain good relationship with banker'
      ]
    },
    {
      id: 'standup-india',
      name: 'Stand Up India Scheme',
      authority: 'Department of Financial Services, Ministry of Finance',
      fundingAmount: '₹10 Lakh - ₹1 Crore',
      totalAllocation: '₹10,000 Crore',
      stage: 'Greenfield enterprises',
      sectors: ['Manufacturing', 'Services', 'Trading'],
      eligibility: [
        'SC/ST and/or Women entrepreneurs (18+ years)',
        'Greenfield enterprise (manufacturing, services, trading)',
        'Loan amount between ₹10 lakh to ₹1 crore',
        'Borrower should not be defaulter',
        'At least one SC/ST and one Women entrepreneur per bank branch'
      ],
      benefits: [
        'Bank loans between ₹10 lakh to ₹1 crore',
        'Composite loan covering term loan and working capital',
        'Repayment period up to 7 years',
        'Moratorium period up to 18 months',
        'Handholding support through Stand Up Connect portal',
        'Credit Guarantee Fund coverage'
      ],
      applicationProcess: [
        'Apply online through Stand Up India portal',
        'Submit business plan and required documents',
        'Bank branch evaluation and processing',
        'Credit appraisal and sanction',
        'Loan agreement and disbursement',
        'Ongoing handholding support'
      ],
      timeline: '45-60 days',
      website: 'https://www.standupmitra.in',
      applicationLink: 'https://www.standupmitra.in/Home/ApplyLoan',
      guidelinesLink: 'https://www.standupmitra.in/Content/pdf/Guidelines.pdf',
      contact: {
        email: 'standupindia.dfs@gov.in',
        phone: '1800-180-1111',
        address: 'Department of Financial Services, New Delhi'
      },
      lastUpdated: '2024-01-08',
      status: 'Active',
      successRate: 45,
      avgProcessingTime: '50 days',
      totalStartupsFunded: 125000,
      pros: [
        'Dedicated scheme for SC/ST and women',
        'Composite loan structure',
        'Handholding and mentoring support',
        'Credit guarantee coverage available',
        'Online application process'
      ],
      cons: [
        'Limited to specific categories only',
        'Minimum loan amount ₹10 lakh',
        'Greenfield enterprises only',
        'One loan per category per branch',
        'Requires detailed business plan'
      ],
      tips: [
        'Prepare comprehensive business plan',
        'Ensure all eligibility documents ready',
        'Utilize Stand Up Connect for guidance',
        'Approach branch with no existing loans in category',
        'Consider composite loan benefits'
      ]
    }
  ],
  state: {
    'Karnataka': [
      {
        id: 'karnataka-startup-policy',
        name: 'Karnataka Startup Policy 2022-2027',
        authority: 'Karnataka Innovation and Technology Society (KITS)',
        fundingAmount: '₹50 Lakh - ₹10 Crore',
        totalAllocation: '₹2,000 Crore',
        stage: 'All stages (Idea to Scale)',
        sectors: ['Technology', 'Innovation', 'R&D', 'DeepTech', 'Biotech'],
        eligibility: [
          'Startup registered and operating in Karnataka',
          'Technology/innovation based startup',
          'Less than 10 years from incorporation',
          'Annual turnover less than ₹100 Crore',
          'Should have innovative product/service'
        ],
        benefits: [
          'Idea2PoC: Up to ₹50 Lakh grant',
          'Elevate: Up to ₹2 Crore for product development',
          'Series A co-investment: Up to ₹10 Crore',
          'Tax incentives and stamp duty exemption',
          'Single-window clearance system',
          'Access to government procurement'
        ],
        applicationProcess: [
          'Register on Karnataka Startup portal',
          'Submit online application with documents',
          'Initial screening by KITS team',
          'Pitch presentation to evaluation committee',
          'Due diligence and background verification',
          'Funding approval and agreement execution'
        ],
        timeline: '2-4 months',
        website: 'https://kits.karnataka.gov.in',
        applicationLink: 'https://kits.karnataka.gov.in/startup-policy',
        guidelinesLink: 'https://kits.karnataka.gov.in/storage/pdf-files/Startup%20Policy.pdf',
        contact: {
          email: 'startup@kits.gov.in',
          phone: '080-2235-2828',
          address: 'KITS, 3rd Floor, Udyog Bhavan, Bangalore 560001'
        },
        lastUpdated: '2024-01-12',
        status: 'Active',
        successRate: 25,
        avgProcessingTime: '3 months',
        totalStartupsFunded: 450,
        pros: [
          'Comprehensive support across all stages',
          'High funding amounts available',
          'Tax benefits and regulatory support',
          'Strong ecosystem in Bangalore',
          'Government procurement opportunities'
        ],
        cons: [
          'Limited to Karnataka-based startups',
          'Highly competitive selection process',
          'Technology focus may exclude other sectors',
          'Lengthy evaluation process',
          'Requires significant documentation'
        ],
        tips: [
          'Highlight technology innovation clearly',
          'Show Karnataka impact and job creation',
          'Prepare strong pitch presentation',
          'Demonstrate scalability potential',
          'Leverage Karnataka startup ecosystem'
        ]
      }
    ],
    'Maharashtra': [
      {
        id: 'maharashtra-startup-policy',
        name: 'Maharashtra State Startup Policy 2023',
        authority: 'Maharashtra State Innovation Society (MahaIT)',
        fundingAmount: '₹25 Lakh - ₹5 Crore',
        totalAllocation: '₹1,500 Crore',
        stage: 'Seed to Series A',
        sectors: ['IT', 'Biotech', 'Clean Energy', 'AgriTech', 'FinTech'],
        eligibility: [
          'Startup registered in Maharashtra',
          'Innovative technology solution',
          'Less than 7 years from incorporation',
          'Scalable business model',
          'Job creation potential'
        ],
        benefits: [
          'Seed funding up to ₹25 Lakh',
          'Growth funding up to ₹5 Crore',
          'Incubation facilities access',
          'Mentorship programs',
          'Market access support',
          'Regulatory sandbox participation'
        ],
        applicationProcess: [
          'Apply through MahaIT startup portal',
          'Submit business plan and pitch deck',
          'Initial evaluation by expert panel',
          'Pitch presentation to investment committee',
          'Due diligence and legal verification',
          'Funding agreement and disbursement'
        ],
        timeline: '3-5 months',
        website: 'https://www.mahait.org',
        applicationLink: 'https://startup.maharashtra.gov.in',
        guidelinesLink: 'https://www.mahait.org/startup-policy-2023.pdf',
        contact: {
          email: 'info@mahait.org',
          phone: '022-2281-5000',
          address: 'MahaIT Corporation, Mumbai 400051'
        },
        lastUpdated: '2024-01-18',
        status: 'Active',
        successRate: 30,
        avgProcessingTime: '4 months',
        totalStartupsFunded: 320,
        pros: [
          'Focus on emerging technologies',
          'Strong industry partnerships',
          'Regulatory sandbox access',
          'Comprehensive ecosystem support',
          'Mumbai financial hub advantage'
        ],
        cons: [
          'Limited to Maharashtra startups only',
          'Sector-specific focus',
          'Competitive selection process',
          'Requires established business model',
          'Lengthy approval timeline'
        ],
        tips: [
          'Align with Maharashtra industrial priorities',
          'Leverage Mumbai ecosystem connections',
          'Show clear technology differentiation',
          'Demonstrate market traction',
          'Highlight job creation in Maharashtra'
        ]
      }
    ]
  },
  sector: {
    'Technology': [
      {
        id: 'tdf',
        name: 'Technology Development Fund (TDF)',
        authority: 'Department of Science & Technology (DST)',
        fundingAmount: '₹1 Crore - ₹10 Crore',
        totalAllocation: '₹500 Crore',
        stage: 'R&D/Technology Development',
        sectors: ['Deep Tech', 'AI/ML', 'IoT', 'Blockchain', 'Quantum Computing'],
        eligibility: [
          'Technology-based startup/company',
          'Innovative R&D project with commercial potential',
          'Strong technical team with relevant expertise',
          'Clear IPR strategy and protection plan',
          'Potential for technology commercialization'
        ],
        benefits: [
          'R&D funding support up to ₹10 Crore',
          'Technology commercialization assistance',
          'IP development and protection support',
          'Market linkage and industry connections',
          'International collaboration opportunities',
          'Mentorship from technology experts'
        ],
        applicationProcess: [
          'Submit detailed project proposal online',
          'Technical evaluation by expert committee',
          'Presentation to Technology Advisory Board',
          'Commercial viability assessment',
          'Funding approval and agreement signing',
          'Milestone-based fund disbursement'
        ],
        timeline: '4-6 months',
        website: 'https://dst.gov.in',
        applicationLink: 'https://onlinedst.gov.in',
        guidelinesLink: 'https://dst.gov.in/sites/default/files/TDF%20Guidelines.pdf',
        contact: {
          email: 'tdf@dst.gov.in',
          phone: '011-2656-7373',
          address: 'Technology Bhawan, New Mehrauli Road, New Delhi 110016'
        },
        lastUpdated: '2024-01-14',
        status: 'Active',
        successRate: 20,
        avgProcessingTime: '5 months',
        totalStartupsFunded: 180,
        pros: [
          'High funding amounts for R&D',
          'Focus on cutting-edge technology',
          'IP protection support',
          'Government backing for credibility',
          'International collaboration opportunities'
        ],
        cons: [
          'Highly technical and competitive',
          'Long evaluation process',
          'Requires strong R&D capabilities',
          'Commercial viability must be proven',
          'Limited to technology sectors only'
        ],
        tips: [
          'Emphasize innovation and technical novelty',
          'Show clear commercialization path',
          'Highlight IP creation potential',
          'Demonstrate team technical expertise',
          'Include industry collaboration plans'
        ]
      }
    ]
  }
};

// Tax benefits and incentives
const TAX_BENEFITS = [
  {
    id: 'section-80iac',
    name: 'Section 80-IAC Tax Exemption',
    description: '100% tax exemption for 3 consecutive years out of first 10 years',
    eligibility: 'DPIIT recognized startups incorporated after April 1, 2016',
    benefit: 'Complete income tax exemption on profits',
    validity: 'Extended till March 31, 2025',
    amount: 'Up to 100% of profits',
    claimProcess: [
      'Obtain DPIIT recognition certificate',
      'File ITR with startup exemption claim',
      'Submit required documents to tax officer',
      'Get approval from Inter-Ministerial Board'
    ],
    documents: ['DPIIT Certificate', 'Audited Financial Statements', 'Board Resolution'],
    pros: ['Complete tax exemption', 'Significant cost savings', 'Government recognition'],
    cons: ['Limited to 3 years only', 'Requires DPIIT recognition', 'Complex approval process']
  },
  {
    id: 'angel-tax-exemption',
    name: 'Angel Tax Exemption (Section 56(2)(viib))',
    description: 'Exemption from Angel Tax on investments above fair market value',
    eligibility: 'DPIIT recognized startups with proper valuation',
    benefit: 'No tax on premium received on issue of shares',
    validity: 'Ongoing for recognized startups',
    amount: 'No limit on investment amount',
    claimProcess: [
      'Obtain DPIIT startup recognition',
      'Get proper valuation from merchant banker/CA',
      'File exemption application with tax department',
      'Maintain proper documentation'
    ],
    documents: ['DPIIT Certificate', 'Valuation Report', 'Investment Agreement'],
    pros: ['Removes investment barriers', 'Encourages angel funding', 'Simplified compliance'],
    cons: ['Requires proper valuation', 'Documentation intensive', 'Limited to recognized startups']
  }
];

// Success stories and case studies
const SUCCESS_STORIES = [
  {
    company: 'Razorpay',
    scheme: 'Karnataka Startup Policy',
    funding: '₹2 Crore',
    outcome: 'Became unicorn, 10,000+ employees',
    year: '2015'
  },
  {
    company: 'Byju\'s',
    scheme: 'SISFS + Tax Benefits',
    funding: '₹50 Lakh',
    outcome: 'Global EdTech leader, $22B valuation',
    year: '2016'
  }
];

export default function FundingPoliciesPage() {
  const [selectedCategory, setSelectedCategory] = useState('central');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [selectedSector, setSelectedSector] = useState('Technology');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const getCurrentSchemes = () => {
    let schemes = [];
    switch (selectedCategory) {
      case 'central':
        schemes = GOVERNMENT_SCHEMES.central;
        break;
      case 'state':
        schemes = GOVERNMENT_SCHEMES.state[selectedState] || [];
        break;
      case 'sector':
        schemes = GOVERNMENT_SCHEMES.sector[selectedSector] || [];
        break;
      default:
        schemes = [];
    }
    
    if (searchTerm) {
      schemes = schemes.filter(scheme => 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.sectors.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return schemes;
  };

  const schemes = getCurrentSchemes();

  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phone) => {
    window.open(`tel:${phone}`, '_blank');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">📋 Government Funding Policies & Schemes</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Comprehensive database of government funding schemes, policies, and tax benefits with detailed analysis
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">35+</p>
              <p className="text-sm text-blue-700">Active Schemes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">₹75K Cr</p>
              <p className="text-sm text-green-700">Total Allocation</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">28</p>
              <p className="text-sm text-purple-700">States Covered</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">45M+</p>
              <p className="text-sm text-orange-700">Beneficiaries</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="central">Central Government</SelectItem>
                <SelectItem value="state">State Government</SelectItem>
                <SelectItem value="sector">Sector Specific</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedCategory === 'state' && (
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {selectedCategory === 'sector' && (
            <div>
              <label className="block text-sm font-medium mb-2">Sector</label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Agriculture">Agriculture</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schemes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schemes">🏛️ Schemes ({schemes.length})</TabsTrigger>
          <TabsTrigger value="tax">💰 Tax Benefits</TabsTrigger>
          <TabsTrigger value="calculator">🧮 Calculator</TabsTrigger>
          <TabsTrigger value="success">🏆 Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="schemes" className="space-y-6">
          {/* Schemes List */}
          <div className="space-y-6">
            {schemes.map((scheme, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        <Building className="w-5 h-5 text-green-600" />
                        {scheme.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{scheme.authority}</Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {scheme.status}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-blue-500" />
                          <span className="text-xs">{scheme.successRate}% success rate</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{scheme.fundingAmount}</p>
                      <p className="text-sm text-muted-foreground">{scheme.stage}</p>
                      <p className="text-xs text-muted-foreground">Total: {scheme.totalAllocation}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{scheme.totalStartupsFunded?.toLocaleString()}</p>
                      <p className="text-xs text-blue-700">Startups Funded</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{scheme.avgProcessingTime}</p>
                      <p className="text-xs text-green-700">Avg Processing</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{scheme.successRate}%</p>
                      <p className="text-xs text-purple-700">Success Rate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Key Benefits
                      </h4>
                      <ul className="space-y-1">
                        {scheme.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        Eligibility Highlights
                      </h4>
                      <ul className="space-y-1">
                        {scheme.eligibility.slice(0, 3).map((criteria, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Timeline</p>
                        <p className="text-xs text-muted-foreground">{scheme.timeline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Contact</p>
                        <button 
                          onClick={() => handleEmailClick(scheme.contact.email)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {scheme.contact.email}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <button 
                          onClick={() => handlePhoneClick(scheme.contact.phone)}
                          className="text-xs text-green-600 hover:underline"
                        >
                          {scheme.contact.phone}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleLinkClick(scheme.applicationLink)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleLinkClick(scheme.guidelinesLink)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Guidelines
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="flex-1">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Building className="w-5 h-5 text-green-600" />
                            {scheme.name}
                          </DialogTitle>
                          <DialogDescription>
                            Detailed information, pros & cons, and application tips
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          {/* Pros and Cons */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Pros
                              </h4>
                              <ul className="space-y-2">
                                {scheme.pros?.map((pro, i) => (
                                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                    <span className="text-green-500 mt-1">✓</span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Cons
                              </h4>
                              <ul className="space-y-2">
                                {scheme.cons?.map((con, i) => (
                                  <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                    <span className="text-red-500 mt-1">✗</span>
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Application Tips */}
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              Application Tips
                            </h4>
                            <ul className="space-y-2">
                              {scheme.tips?.map((tip, i) => (
                                <li key={i} className="text-sm text-blue-700 flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">💡</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Complete Eligibility */}
                          <div>
                            <h4 className="font-semibold mb-3">Complete Eligibility Criteria</h4>
                            <ul className="space-y-2">
                              {scheme.eligibility.map((criteria, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {criteria}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Application Process */}
                          <div>
                            <h4 className="font-semibold mb-3">Step-by-Step Application Process</h4>
                            <div className="space-y-3">
                              {scheme.applicationProcess.map((step, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {i + 1}
                                  </div>
                                  <span className="text-sm">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4 border-t">
                            <Button 
                              onClick={() => handleLinkClick(scheme.applicationLink)}
                              className="flex-1"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Apply Online
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleLinkClick(scheme.website)}
                              className="flex-1"
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              Official Website
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleEmailClick(scheme.contact.email)}
                              className="flex-1"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Contact Support
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

        <TabsContent value="tax" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TAX_BENEFITS.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    {benefit.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Benefit Amount:</p>
                      <p className="text-lg font-bold text-green-600">{benefit.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Validity:</p>
                      <Badge variant="outline">{benefit.validity}</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Eligibility:</p>
                    <p className="text-xs text-muted-foreground">{benefit.eligibility}</p>
                  </div>

                  {/* Pros and Cons for Tax Benefits */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2 text-green-600">Pros:</p>
                      <ul className="space-y-1">
                        {benefit.pros.map((pro, i) => (
                          <li key={i} className="text-xs text-green-600 flex items-start gap-1">
                            <span>✓</span> {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 text-red-600">Cons:</p>
                      <ul className="space-y-1">
                        {benefit.cons.map((con, i) => (
                          <li key={i} className="text-xs text-red-600 flex items-start gap-1">
                            <span>✗</span> {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="w-full">
                        <Calculator className="w-4 h-4 mr-2" />
                        View Claim Process
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{benefit.name} - Claim Process</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Required Documents:</h4>
                          <ul className="space-y-1">
                            {benefit.documents.map((doc, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Claim Process:</h4>
                          <ol className="space-y-2">
                            {benefit.claimProcess.map((step, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {i + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🧮 Funding Eligibility Calculator</CardTitle>
              <p className="text-muted-foreground">Check your eligibility for various government schemes</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Age (Years)</label>
                  <Input type="number" placeholder="e.g., 2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Turnover (₹ Crore)</label>
                  <Input type="number" placeholder="e.g., 5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sector</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                Check Eligibility
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUCCESS_STORIES.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    {story.company}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Scheme Used:</span>
                    <Badge variant="outline">{story.scheme}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Initial Funding:</span>
                    <span className="font-bold text-green-600">{story.funding}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Outcome:</span>
                    <p className="text-sm text-muted-foreground mt-1">{story.outcome}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">Success Year:</span>
                    <Badge>{story.year}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dock />
    </div>
  );
}