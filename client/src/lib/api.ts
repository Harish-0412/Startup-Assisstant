// API Service Layer for Nivesh.ai Frontend
// Connects to FastAPI backend

// Production: Use VITE_API_URL env variable
// Development: Auto-detect localhost:8000
const API_BASE_URL = typeof window !== 'undefined' 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  : 'http://localhost:8000';

// Auto-start backend if not running
export async function startBackendIfNeeded(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) return;
  } catch (error) {
    // Backend not running, try to start it
    console.log('Starting backend server...');
    try {
      // For Windows, execute the batch file
      if (typeof window !== 'undefined') {
        const startScript = document.createElement('script');
        startScript.src = 'data:text/javascript,window.open("start-backend.bat", "_blank");';
        document.head.appendChild(startScript);
        document.head.removeChild(startScript);
      }
    } catch (startError) {
      console.warn('Could not auto-start backend:', startError);
    }
  }
}

// Test backend connectivity
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}

export interface FounderProfile {
  startup_stage: string;
  sector: string;
  location: string;
  funding_goal: string;
  preferred_language: string;
}

export interface FundingQuestion {
  question: string;
  context?: string;
}

export interface FundingAdvice {
  readiness_score: number;
  recommended_path: string;
  explanation: string;
  checklist: string[];
  language: string;
}

// Profile endpoints
export async function saveFounderProfile(profile: FounderProfile & { documents?: File[] }): Promise<any> {
  try {
    const { documents, ...profileData } = profile;
    
    // First save the profile
    const profileResponse = await fetch(`${API_BASE_URL}/founder/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    
    if (!profileResponse.ok) {
      throw new Error(`HTTP ${profileResponse.status}: ${profileResponse.statusText}`);
    }
    
    const profileResult = await profileResponse.json();
    
    // Then upload documents if any
    if (documents && documents.length > 0) {
      try {
        const formData = new FormData();
        documents.forEach((file) => {
          formData.append('files', file);
        });
        
        const docResponse = await fetch(`${API_BASE_URL}/founder/documents`, {
          method: 'POST',
          body: formData,
        });
        
        if (docResponse.ok) {
          const docResult = await docResponse.json();
          return { ...profileResult, documents: docResult };
        } else {
          console.warn('Document upload failed, but profile saved:', await docResponse.text());
        }
      } catch (docError) {
        console.warn('Document upload error (profile still saved):', docError);
      }
    }
    
    return profileResult;
  } catch (error) {
    console.error('Error saving founder profile:', error);
    throw error;
  }
}

export async function getFounderProfile(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/founder/profile`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching founder profile:', error);
    throw error;
  }
}

// Chat/Advice endpoints
export async function getFundingAdvice(question: FundingQuestion): Promise<FundingAdvice> {
  try {
    // Auto-start backend if needed
    await startBackendIfNeeded();
    
    // Test connection first
    const isConnected = await testBackendConnection();
    if (!isConnected) {
      throw new Error('Please save your founder profile first using /founder/profile');
    }

    const response = await fetch(`${API_BASE_URL}/funding/advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error('Please save your founder profile first using /founder/profile');
      }
      throw new Error(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching funding advice:', error);
    throw error;
  }
}

// Health check
export async function healthCheck(): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}

// New Feature Interfaces
export interface InvestorMatch {
  name: string;
  type: string;
  focus_sectors: string[];
  location: string;
  typical_ticket_size: string;
  match_score: number;
  why_match: string;
}

export interface FundingTimeline {
  current_stage: string;
  target_stage: string;
  estimated_months: number;
  milestones: string[];
  risks: string[];
  recommendations: string[];
}

export interface MarketInsight {
  sector: string;
  market_size: string;
  growth_rate: string;
  key_trends: string[];
  opportunities: string[];
  challenges: string[];
  competitor_landscape: string;
}

// Investor Matching
export async function getInvestorMatches(): Promise<{ investors: InvestorMatch[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/investors/match`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching investor matches:', error);
    throw error;
  }
}

// Funding Timeline
export async function getFundingTimeline(stage?: string, goal?: string): Promise<FundingTimeline> {
  try {
    const response = await fetch(`${API_BASE_URL}/funding/timeline`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    const s = (stage || '').toLowerCase();
    const g = (goal || '').toLowerCase();
    const current = s || 'idea';
    const target = g.includes('vc') ? 'vc-ready' : g.includes('angel') ? 'seed-ready' : 'grant-ready';
    const months = g.includes('vc') ? 6 : 3;
    const baseMilestones = [
      'Refine pitch narrative',
      'Build financial model',
      'Collect traction metrics',
      'Create investor list',
      'Warm introductions'
    ];
    const recs = g.includes('grant')
      ? ['Identify relevant schemes', 'Prepare application dossier', 'Gather compliance docs']
      : g.includes('vc')
      ? ['Strengthen unit economics', 'Demonstrate growth', 'Prepare data room']
      : ['Highlight PMF signals', 'Show early revenue', 'Engage angel networks'];
    return {
      current_stage: current,
      target_stage: target,
      estimated_months: months,
      milestones: baseMilestones,
      risks: ['Market uncertainty', 'Hiring bottlenecks', 'Regulatory changes'],
      recommendations: recs,
    };
  }
}

// Market Insights
export async function getMarketInsights(sector?: string): Promise<MarketInsight> {
  try {
    const response = await fetch(`${API_BASE_URL}/market/insights`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    const s = (sector || 'General').toLowerCase();
    const map: Record<string, MarketInsight> = {
      saas: {
        sector: 'SaaS',
        market_size: 'USD 200B+ global',
        growth_rate: '15-20% CAGR',
        key_trends: ['AI-assisted workflows', 'Vertical SaaS', 'Usage-based pricing'],
        opportunities: ['SMB automation', 'AI copilots', 'India SaaS export'],
        challenges: ['Churn control', 'Global competition', 'Security compliance'],
        competitor_landscape: 'Global incumbents and agile startups across verticals',
      },
      fintech: {
        sector: 'FinTech',
        market_size: 'USD 150B+ India + Global',
        growth_rate: '18-22% CAGR',
        key_trends: ['Embedded finance', 'UPI rails', 'AI risk scoring'],
        opportunities: ['SME lending', 'Wealth tech', 'Cross-border payments'],
        challenges: ['Regulatory shifts', 'Fraud risk', 'Capital efficiency'],
        competitor_landscape: 'Banks, NBFCs, neobanks, and payment players',
      },
      agritech: {
        sector: 'AgriTech',
        market_size: 'USD 50B+ India',
        growth_rate: '10-14% CAGR',
        key_trends: ['Precision farming', 'Supply chain digitization', 'Input marketplaces'],
        opportunities: ['Farmer services', 'Traceability', 'Cold chain tech'],
        challenges: ['Fragmented supply', 'Seasonality', 'Capex needs'],
        competitor_landscape: 'Regional players and platform startups',
      },
      healthtech: {
        sector: 'HealthTech',
        market_size: 'USD 100B+ India + Global',
        growth_rate: '12-16% CAGR',
        key_trends: ['Telemedicine', 'Remote monitoring', 'AI diagnostics'],
        opportunities: ['Chronic disease care', 'Hospital IT', 'Insurance integrations'],
        challenges: ['Regulatory approvals', 'Data privacy', 'Clinical validation'],
        competitor_landscape: 'Hospitals, insurers, digital care platforms',
      },
      edtech: {
        sector: 'EdTech',
        market_size: 'USD 70B+ global',
        growth_rate: '8-12% CAGR',
        key_trends: ['Skill-upskilling', 'AI tutoring', 'Hybrid learning'],
        opportunities: ['Vocational training', 'Corporate L&D', 'Assessment tools'],
        challenges: ['CAC control', 'Retention', 'Outcome proof'],
        competitor_landscape: 'Global platforms and niche vertical players',
      },
      d2c: {
        sector: 'D2C',
        market_size: 'USD 25B+ India',
        growth_rate: '20%+ CAGR in segments',
        key_trends: ['Clean labels', 'Community brands', 'Omnichannel'],
        opportunities: ['Niche categories', 'Marketplace optimization', 'Export D2C'],
        challenges: ['Working capital', 'Logistics cost', 'Brand trust'],
        competitor_landscape: 'Category leaders and fast followers',
      },
      deeptech: {
        sector: 'DeepTech',
        market_size: 'Varies by domain',
        growth_rate: 'High in AI/Robotics',
        key_trends: ['AI agents', 'Edge computing', 'Robotics'],
        opportunities: ['Industry automation', 'Safety systems', 'Autonomous ops'],
        challenges: ['R&D funding', 'Talent density', 'Commercialization'],
        competitor_landscape: 'Global tech firms and research spin-offs',
      },
      general: {
        sector: 'General',
        market_size: 'Varies',
        growth_rate: 'Varies',
        key_trends: ['Digitization', 'AI augmentation', 'Cloud adoption'],
        opportunities: ['Workflow automation', 'Analytics', 'Platform plays'],
        challenges: ['Competition', 'Distribution', 'Monetization'],
        competitor_landscape: 'Fragmented with category leaders',
      },
    };
    const key = Object.keys(map).includes(s) ? s : 'general';
    return map[key];
  }
}

// Readiness Score
export interface ReadinessScore {
  score: number;
  confidence: string;
  badge_color: string;
  breakdown: {
    stage: number;
    sector: number;
    funding_goal: number;
    location: number;
    alignment: number;
  };
  max_score: number;
}

export async function getReadinessScore(): Promise<ReadinessScore> {
  try {
    const response = await fetch(`${API_BASE_URL}/readiness/score`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching readiness score:', error);
    throw error;
  }
}

// 7-Day Action Plan
export interface ActionPlanItem {
  day: string;
  task: string;
  priority: string;
  category: string;
}

export interface ActionPlan {
  plan: ActionPlanItem[];
  total_days: number;
  profile_context: {
    stage: string;
    sector: string;
    location: string;
    funding_goal: string;
  };
}

export async function get7DayActionPlan(): Promise<ActionPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/action-plan/7day`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching action plan:', error);
    throw error;
  }
}

// Express/RAG endpoints (relative to same origin)
export async function uploadPitchDeckPDF(file: File): Promise<any> {
  const form = new FormData();
  form.append('pdf', file);
  const res = await fetch('/api/documents/upload-pdf', {
    method: 'POST',
    body: form,
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return await res.json();
}

export async function buildVectorDB(): Promise<any> {
  const res = await fetch('/api/vector-db/build', {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return await res.json();
}

export async function searchDocuments(query: string, topK: number = 5): Promise<any> {
  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, topK })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return await res.json();
}

export async function askChat(question: string, type: 'general' | 'funding' = 'general', sessionId?: string): Promise<{
  sessionId: string;
  answer: string;
  references: any[];
  language: string;
  status: string;
}> {
  try {
    const res = await fetch('/api/chat/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ question, type, sessionId })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return await res.json();
  } catch (e) {
    return {
      sessionId: '',
      answer: question,
      references: [],
      language: 'en',
      status: 'error',
    };
  }
}
