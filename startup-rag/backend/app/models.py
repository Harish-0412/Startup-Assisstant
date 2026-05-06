from pydantic import BaseModel
from typing import List, Optional

class FounderProfile(BaseModel):
    startup_stage: str  # "idea", "mvp", "early_traction", "growth"
    sector: str
    location: str
    funding_goal: str
    preferred_language: str  # "english", "hindi", "tamil", etc.

class FundingQuestion(BaseModel):
    question: str
    context: Optional[str] = None

class FundingAdvice(BaseModel):
    readiness_score: int
    recommended_path: str
    explanation: str
    checklist: List[str]
    language: str

class InvestorMatch(BaseModel):
    name: str
    type: str  # "Angel", "VC", "Grant"
    focus_sectors: List[str]
    location: str
    typical_ticket_size: str
    match_score: float
    why_match: str

class FundingTimeline(BaseModel):
    current_stage: str
    target_stage: str
    estimated_months: int
    milestones: List[str]
    risks: List[str]
    recommendations: List[str]

class MarketInsight(BaseModel):
    sector: str
    market_size: str
    growth_rate: str
    key_trends: List[str]
    opportunities: List[str]
    challenges: List[str]
    competitor_landscape: str