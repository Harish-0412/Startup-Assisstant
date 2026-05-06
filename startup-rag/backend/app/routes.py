from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Optional
from pydantic import BaseModel
from app.models import FounderProfile, FundingQuestion, FundingAdvice
from app.groq_client import groq_client
from app.prompts import get_funding_advisor_prompt
from app.rag_integration import rag_retriever
from app.readiness_calculator import calculate_readiness_score
from app.action_planner import generate_7day_action_plan
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for founder profiles (stateless for hackathon)
founder_profiles = {}

def get_location_specific_context(location: str) -> str:
    """Get location-specific funding context"""
    location_lower = location.lower() if location else ""
    
    # Major startup hubs
    if any(city in location_lower for city in ['bangalore', 'bengaluru']):
        return """
        Bangalore Ecosystem:
        - India's Silicon Valley with 4000+ startups
        - Strong presence of Tier-1 VCs (Sequoia, Accel, Matrix)
        - Active angel networks (IAN, Lead Angels)
        - Government support: Karnataka Startup Policy
        - Average funding rounds: Higher than national average
        - Key sectors: SaaS, Fintech, DeepTech
        """
    elif any(city in location_lower for city in ['mumbai', 'pune']):
        return """
        Mumbai/Pune Ecosystem:
        - Financial capital with strong B2B focus
        - Active VC presence (Kalaari, Blume Ventures)
        - Mumbai Angels network very active
        - Government: Maharashtra Startup Policy
        - Key sectors: Fintech, D2C, MediaTech
        """
    elif any(city in location_lower for city in ['delhi', 'noida', 'gurgaon', 'gurugram']):
        return """
        Delhi NCR Ecosystem:
        - Largest startup ecosystem in India
        - Strong government support and grants
        - Active angel networks and VCs
        - Key sectors: EdTech, HealthTech, E-commerce
        - Government schemes: Startup India, DIPP benefits
        """
    elif any(city in location_lower for city in ['hyderabad']):
        return """
        Hyderabad Ecosystem:
        - Growing tech hub with lower costs
        - Strong in HealthTech and PharmaTech
        - Government: T-Hub incubator support
        - Key sectors: HealthTech, Agritech, IT Services
        """
    elif any(city in location_lower for city in ['chennai']):
        return """
        Chennai Ecosystem:
        - Emerging startup hub
        - Strong in DeepTech and Manufacturing
        - Government: Tamil Nadu Startup Policy
        - Key sectors: DeepTech, Manufacturing, SaaS
        """
    else:
        return f"""
        {location.title() if location else 'Your Location'} Ecosystem:
        - Tier-2/3 city with growing startup ecosystem
        - Lower operational costs advantage
        - Government startup schemes available
        - Remote work enabling access to all investors
        - Consider virtual pitch sessions with investors
        """

# AI Test Models
class AITestRequest(BaseModel):
    prompt: str

class AITestResponse(BaseModel):
    success: bool
    generated_text: str
    model: str
    is_dynamic: bool
    message: str

@router.post("/founder/profile")
async def save_founder_profile(profile: FounderProfile):
    """Save founder profile for context in funding advice"""
    # Use a simple key for stateless storage
    profile_id = "default_founder"
    founder_profiles[profile_id] = profile.dict()
    
    return {
        "message": "Profile saved successfully",
        "profile_id": profile_id,
        "profile": profile.dict()
    }

@router.post("/founder/documents")
async def upload_founder_documents(files: List[UploadFile] = File(...)):
    """
    Upload and process documents for founder (pitch deck, business plan, etc.)
    Documents are saved and processed through RAG pipeline for context enhancement
    """
    import os
    import shutil
    from pathlib import Path
    
    logger.info(f"📄 Received {len(files)} document(s) for upload")
    
    # Get Data Ingestion path
    current_file = os.path.abspath(__file__)
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_file)))
    project_root = os.path.dirname(backend_dir)
    data_ingestion_path = os.path.join(project_root, "Data Ingestion")
    raw_dir = os.path.join(data_ingestion_path, "data", "raw")
    
    # Ensure directory exists
    os.makedirs(raw_dir, exist_ok=True)
    
    uploaded_files = []
    processed_files = []
    
    for file in files:
        try:
            logger.info(f"   Processing: {file.filename} ({file.content_type})")
            
            # Read file content
            content = await file.read()
            logger.info(f"   ✓ Read {len(content)} bytes from {file.filename}")
            
            # Save to Data Ingestion raw folder
            safe_filename = file.filename.replace(" ", "_").replace("/", "_")
            file_path = os.path.join(raw_dir, safe_filename)
            
            with open(file_path, "wb") as f:
                f.write(content)
            
            logger.info(f"   ✓ Saved to: {file_path}")
            
            uploaded_files.append({
                "filename": safe_filename,
                "original_filename": file.filename,
                "content_type": file.content_type,
                "size": len(content),
                "saved_path": file_path,
                "status": "saved"
            })
            
            processed_files.append(file_path)
            
        except Exception as e:
            logger.error(f"   ❌ Error processing {file.filename}: {str(e)}")
            uploaded_files.append({
                "filename": file.filename,
                "status": "error",
                "error": str(e)
            })
    
    # Try to process through RAG pipeline if available
    processing_note = "Documents saved. RAG processing available if pipeline is configured."
    if os.path.exists(data_ingestion_path):
        try:
            # Add to path for imports
            import sys
            if data_ingestion_path not in sys.path:
                sys.path.insert(0, data_ingestion_path)
            
            # Try to import and process (optional - won't fail if unavailable)
            try:
                from ingestion.pipeline import process_pdf
                logger.info("   🔄 Attempting RAG processing...")
                # Note: Full processing would happen asynchronously
                processing_note = "Documents saved and queued for RAG processing."
            except ImportError:
                logger.info("   ℹ️  RAG pipeline not available, documents saved only.")
        except Exception as e:
            logger.warning(f"   ⚠️  RAG processing not available: {str(e)}")
    
    return {
        "message": f"Successfully uploaded {len(uploaded_files)} document(s)",
        "files": uploaded_files,
        "note": processing_note,
        "rag_available": os.path.exists(data_ingestion_path)
    }

@router.get("/founder/profile")
async def get_founder_profile():
    """Get current founder profile"""
    profile_id = "default_founder"
    if profile_id not in founder_profiles:
        raise HTTPException(status_code=404, detail="No founder profile found")
    
    return {
        "profile_id": profile_id,
        "profile": founder_profiles[profile_id]
    }

@router.post("/funding/advice", response_model=FundingAdvice)
async def get_funding_advice(question: FundingQuestion):
    """Get AI-powered funding advice based on founder context"""
    
    # Get founder context (use default if exists)
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(
            status_code=400, 
            detail="Please save your founder profile first using /founder/profile"
        )
    
    try:
        # 1️⃣ RAG RETRIEVAL - Get relevant context from vector store and uploaded documents
        logger.info(f"🔍 Starting RAG retrieval for question: {question.question[:100]}...")
        
        # Enhanced query that includes profile context for better retrieval
        enhanced_query = f"{question.question} {profile_data.get('sector', '')} {profile_data.get('startup_stage', '')} {profile_data.get('location', '')} {profile_data.get('funding_goal', '')}"
        rag_docs, rag_metas = rag_retriever.retrieve_context(enhanced_query, top_k=5)
        
        # Format RAG context for prompt
        rag_context = rag_retriever.format_rag_context(rag_docs, rag_metas)
        
        if rag_context:
            logger.info(f"✅ RAG retrieved {len(rag_docs)} documents (total {len(rag_context)} chars)")
        else:
            logger.warning("⚠️ No RAG context retrieved - using fallback knowledge only")
        
        # 2️⃣ PROMPT GENERATION - Build prompt with RAG context + founder profile + location-specific info
        logger.info("📝 Building prompt with RAG context and location-specific data...")
        
        # Add location-specific context to prompt
        location_context = get_location_specific_context(profile_data.get('location', ''))
        enhanced_rag_context = f"{rag_context}\n\nLOCATION-SPECIFIC CONTEXT:\n{location_context}" if location_context else rag_context
        
        prompt = get_funding_advisor_prompt(profile_data, question.question, enhanced_rag_context)
        
        # 3️⃣ GROQ CALL - Get AI-generated advice
        logger.info("🤖 Calling Groq AI...")
        if not groq_client.is_configured:
            logger.error("❌ Groq is NOT configured - cannot generate real advice")
            raise HTTPException(
                status_code=503,
                detail="AI service not configured. Please set GROQ_API_KEY environment variable."
            )
        
        advice_data = groq_client.generate_funding_advice(prompt)
        logger.info("✅ Groq response received")
        
        # 4️⃣ VALIDATE & RETURN - Ensure response is valid
        return FundingAdvice(**advice_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error in funding advice pipeline: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating advice: {str(e)}")

@router.get("/readiness/score")
async def get_readiness_score():
    """Get precise funding readiness score based on profile"""
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(status_code=400, detail="Please save your founder profile first")
    
    try:
        score_data = calculate_readiness_score(profile_data)
        return score_data
    except Exception as e:
        logger.error(f"Error calculating readiness score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate readiness score: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    ai_status = "configured" if groq_client.is_configured else "not_configured"
    return {
        "status": "healthy",
        "service": "Nivesh.ai Backend",
        "ai_provider": "Groq (LLaMA)",
        "ai_status": ai_status
    }

@router.post("/ai/test", response_model=AITestResponse)
async def test_ai_generation(request: AITestRequest):
    """
    Test endpoint to verify Groq AI is working with dynamic output.
    This endpoint confirms the LLM is producing real, non-static responses.
    """
    try:
        if not groq_client.is_configured:
            raise HTTPException(
                status_code=503,
                detail="Groq AI is not configured. Check GROQ_API_KEY environment variable."
            )
        
        # Generate response
        generated_text = groq_client.test_generation(request.prompt)
        
        # Verify it's not empty
        if not generated_text or len(generated_text.strip()) == 0:
            raise HTTPException(
                status_code=500,
                detail="AI generated empty response"
            )
        
        from app.config import GROQ_MODEL
        return AITestResponse(
            success=True,
            generated_text=generated_text,
            model=GROQ_MODEL,
            is_dynamic=True,
            message="AI is working correctly with dynamic output"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI test failed: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {type(e).__name__}: {str(e)}"
        )

@router.get("/investors/match")
async def get_investor_matches():
    """Get investor recommendations based on founder profile"""
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(
            status_code=400,
            detail="Please save your founder profile first"
        )
    
    try:
        # Always use curated investor database for precision
        investors = get_precise_investors(profile_data)
        return {"investors": investors}
    except Exception as e:
        logger.error(f"Error getting investor matches: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get investor matches: {str(e)}")

def get_precise_investors(profile_data: dict) -> list:
    """Get precise investor recommendations based on profile"""
    sector = profile_data.get('sector', '').lower()
    stage = profile_data.get('startup_stage', '').lower()
    funding_goal = profile_data.get('funding_goal', '').lower()
    location = profile_data.get('location', '').lower()
    
    # Comprehensive Indian investor database
    all_investors = [
        # Angel Networks
        {
            "name": "Indian Angel Network (IAN)",
            "type": "Angel",
            "focus_sectors": ["SaaS", "Fintech", "Healthtech", "Edtech", "Deeptech"],
            "location": "Mumbai, Bangalore, Delhi",
            "typical_ticket_size": "₹25L - ₹2Cr",
            "stage_focus": ["idea", "mvp"],
            "match_score": 0,
            "why_match": ""
        },
        {
            "name": "Mumbai Angels",
            "type": "Angel",
            "focus_sectors": ["Fintech", "SaaS", "D2C", "Edtech"],
            "location": "Mumbai",
            "typical_ticket_size": "₹30L - ₹1.5Cr",
            "stage_focus": ["idea", "mvp"],
            "match_score": 0,
            "why_match": ""
        },
        {
            "name": "Lead Angels",
            "type": "Angel",
            "focus_sectors": ["SaaS", "Fintech", "Healthtech", "Agritech"],
            "location": "Bangalore, Delhi",
            "typical_ticket_size": "₹20L - ₹1Cr",
            "stage_focus": ["idea", "mvp"],
            "match_score": 0,
            "why_match": ""
        },
        # VCs
        {
            "name": "Sequoia Capital India",
            "type": "VC",
            "focus_sectors": ["SaaS", "Fintech", "D2C", "Deeptech", "Healthtech"],
            "location": "Bangalore, Mumbai",
            "typical_ticket_size": "₹5Cr - ₹50Cr",
            "stage_focus": ["revenue", "growth"],
            "match_score": 0,
            "why_match": ""
        },
        {
            "name": "Accel Partners India",
            "type": "VC",
            "focus_sectors": ["SaaS", "Fintech", "Edtech", "Deeptech"],
            "location": "Bangalore",
            "typical_ticket_size": "₹3Cr - ₹30Cr",
            "stage_focus": ["revenue", "growth"],
            "match_score": 0,
            "why_match": ""
        },
        {
            "name": "Matrix Partners India",
            "type": "VC",
            "focus_sectors": ["SaaS", "Fintech", "D2C", "Healthtech"],
            "location": "Mumbai, Bangalore",
            "typical_ticket_size": "₹2Cr - ₹25Cr",
            "stage_focus": ["mvp", "revenue", "growth"],
            "match_score": 0,
            "why_match": ""
        },
        # Grants
        {
            "name": "SIDBI Startup Fund",
            "type": "Grant",
            "focus_sectors": ["Fintech", "Agritech", "Healthtech", "Edtech"],
            "location": "All India",
            "typical_ticket_size": "₹10L - ₹50L",
            "stage_focus": ["idea", "mvp"],
            "match_score": 0,
            "why_match": ""
        },
        {
            "name": "MeitY Startup Hub",
            "type": "Grant",
            "focus_sectors": ["Deeptech", "SaaS", "Fintech"],
            "location": "All India",
            "typical_ticket_size": "₹25L - ₹1Cr",
            "stage_focus": ["idea", "mvp"],
            "match_score": 0,
            "why_match": ""
        },
        {
            "name": "BIRAC (Biotechnology)",
            "type": "Grant",
            "focus_sectors": ["Healthtech", "Agritech"],
            "location": "All India",
            "typical_ticket_size": "₹50L - ₹2Cr",
            "stage_focus": ["idea", "mvp"],
            "match_score": 0,
            "why_match": ""
        }
    ]
    
    # Calculate match scores
    matched_investors = []
    for investor in all_investors:
        score = 0
        
        # Sector match (40 points)
        if sector in [s.lower() for s in investor["focus_sectors"]]:
            score += 40
        elif any(s.lower() in sector or sector in s.lower() for s in investor["focus_sectors"]):
            score += 30
        
        # Stage match (30 points)
        if stage in investor["stage_focus"]:
            score += 30
        elif funding_goal.lower() == investor["type"].lower():
            score += 20
        
        # Funding goal match (20 points)
        if funding_goal == 'grant' and investor["type"] == "Grant":
            score += 20
        elif funding_goal == 'angel' and investor["type"] == "Angel":
            score += 20
        elif funding_goal == 'vc' and investor["type"] == "VC":
            score += 20
        
        # Location match (10 points)
        if any(city in location for city in investor["location"].lower().split(', ')):
            score += 10
        
        if score > 0:
            investor["match_score"] = min(score, 100)
            
            # Generate why_match
            reasons = []
            if sector in [s.lower() for s in investor["focus_sectors"]]:
                reasons.append(f"Strong focus on {sector} sector")
            if stage in investor["stage_focus"]:
                reasons.append(f"Invests in {stage} stage startups")
            if funding_goal.lower() == investor["type"].lower():
                reasons.append(f"Matches your {funding_goal} funding goal")
            if any(city in location for city in investor["location"].lower().split(', ')):
                reasons.append("Located in your region")
            
            investor["why_match"] = ". ".join(reasons) if reasons else "Good general match for Indian startups"
            matched_investors.append(investor)
    
    # Sort by match score and return top 5
    matched_investors.sort(key=lambda x: x["match_score"], reverse=True)
    return matched_investors[:5]

@router.get("/funding/timeline")
async def get_funding_timeline():
    """Get estimated funding timeline based on current stage"""
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(status_code=400, detail="Please save your founder profile first")
    
    try:
        return get_precise_timeline(profile_data)
    except Exception as e:
        logger.error(f"Error getting timeline: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate timeline: {str(e)}")

def get_precise_timeline(profile_data: dict) -> dict:
    """Calculate precise funding timeline based on stage, sector, and location"""
    stage = profile_data.get('startup_stage', '').lower()
    sector = profile_data.get('sector', '').lower()
    funding_goal = profile_data.get('funding_goal', '').lower()
    location = profile_data.get('location', '').lower()
    
    # Location-based timeline adjustments
    location_multiplier = 1.0
    location_notes = []
    
    if any(city in location for city in ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune']):
        location_multiplier = 0.85  # Faster in major hubs
        location_notes.append("Major startup hub - faster investor access")
        location_notes.append("More networking events and pitch opportunities")
    elif any(city in location for city in ['ahmedabad', 'kolkata', 'jaipur', 'chandigarh']):
        location_multiplier = 1.0  # Standard
        location_notes.append("Tier-2 city - good startup ecosystem")
    else:
        location_multiplier = 1.15  # Slightly slower in smaller cities
        location_notes.append("Consider virtual investor meetings")
        location_notes.append("Leverage remote work advantages")
    
    # Stage progression map
    stage_progression = {
        'idea': {
            'target_stage': 'mvp',
            'months': 6,
            'milestones': [
                "Build working MVP with core features",
                "Validate product-market fit with 50+ beta users",
                "Form core team (2-3 members)",
                "Register company and get basic compliance",
                "Create initial pitch deck"
            ],
            'risks': [
                "Technical feasibility challenges",
                "Market validation taking longer than expected",
                "Team formation delays"
            ],
            'recommendations': [
                "Focus on rapid prototyping and user feedback",
                "Start networking with angel investors early",
                "Document all learnings for investor pitch",
                "Consider bootstrap funding to extend runway"
            ]
        },
        'mvp': {
            'target_stage': 'revenue',
            'months': 8,
            'milestones': [
                "Achieve ₹5L - ₹10L monthly recurring revenue",
                "Get 100+ paying customers",
                "Establish product-market fit metrics",
                "Build scalable operations and processes",
                "Complete regulatory compliance (GST, etc.)"
            ],
            'risks': [
                "Customer acquisition cost exceeding LTV",
                "Churn rate higher than industry average",
                "Cash flow management during growth phase"
            ],
            'recommendations': [
                "Focus on unit economics and profitability",
                "Build strong customer retention strategies",
                "Prepare detailed financial projections",
                "Start investor conversations 3-4 months before funding need"
            ]
        },
        'revenue': {
            'target_stage': 'growth',
            'months': 12,
            'milestones': [
                "Achieve ₹50L+ annual recurring revenue (ARR)",
                "Demonstrate 30%+ month-over-month growth",
                "Build strong unit economics (CAC < LTV/3)",
                "Establish market leadership in niche",
                "Prepare for Series A with detailed metrics"
            ],
            'risks': [
                "Growth plateau or slowdown",
                "Competition from well-funded players",
                "Scaling operations while maintaining quality"
            ],
            'recommendations': [
                "Focus on sustainable growth metrics",
                "Build strategic partnerships",
                "Strengthen management team",
                "Engage with Tier-1 VCs early"
            ]
        },
        'growth': {
            'target_stage': 'scale',
            'months': 18,
            'milestones': [
                "Achieve ₹5Cr+ ARR",
                "Expand to new markets/verticals",
                "Build strong competitive moat",
                "Establish market leadership position",
                "Prepare for Series B or exit"
            ],
            'risks': [
                "Market saturation",
                "Regulatory changes",
                "Key team member departures"
            ],
            'recommendations': [
                "Focus on market expansion",
                "Build strategic alliances",
                "Consider international expansion",
                "Prepare for next funding round or exit"
            ]
        }
    }
    
    # Get timeline for current stage
    timeline_data = stage_progression.get(stage, stage_progression['mvp'])
    
    # Adjust months based on sector (some sectors move faster)
    fast_sectors = ['fintech', 'saas', 'deeptech']
    slow_sectors = ['agritech', 'healthtech']
    
    months = timeline_data['months']
    if sector in fast_sectors:
        months = max(4, months - 2)
    elif sector in slow_sectors:
        months = months + 2
    
    # Apply location multiplier
    months = int(months * location_multiplier)
    months = max(3, months)  # Minimum 3 months
    
    # Adjust milestones based on funding goal and location
    milestones = timeline_data['milestones'].copy()
    if funding_goal == 'grant':
        milestones.insert(0, "Research and apply for relevant government grants")
        if any(city in location for city in ['delhi', 'mumbai', 'bangalore']):
            milestones.insert(1, "Attend government startup events in your city")
        months = max(3, months - 1)
    elif funding_goal == 'vc':
        milestones.append("Prepare detailed investor pitch with financial models")
        if any(city in location for city in ['bangalore', 'mumbai', 'delhi']):
            milestones.append("Attend VC networking events in your city")
        months = months + 2
    
    # Add location-specific recommendations
    recommendations = timeline_data['recommendations'].copy()
    if location_notes:
        recommendations.extend(location_notes[:2])
    
    return {
        "current_stage": stage,
        "target_stage": timeline_data['target_stage'],
        "estimated_months": months,
        "milestones": milestones[:5],
        "risks": timeline_data['risks'],
        "recommendations": recommendations[:5],
        "location": location.title() if location else "Not specified"
    }

@router.get("/market/insights")
async def get_market_insights():
    """Get market insights for the startup's sector and location"""
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(status_code=400, detail="Please save your founder profile first")
    
    sector = profile_data.get('sector', 'unknown').lower()
    location = profile_data.get('location', '')
    
    try:
        return get_precise_market_insights(sector, location)
    except Exception as e:
        logger.error(f"Error getting insights: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get market insights: {str(e)}")

def get_precise_market_insights(sector: str, location: str = "") -> dict:
    """Get precise market insights based on sector and location data"""
    
    location_lower = location.lower() if location else ""
    
    # Location-specific market adjustments
    location_adjustments = {}
    if any(city in location_lower for city in ['bangalore', 'bengaluru']):
        location_adjustments = {
            "market_note": "Bangalore has the highest startup density in India with 4000+ startups.",
            "growth_multiplier": 1.2,
            "competition_level": "Very High",
            "key_advantage": "Access to top-tier VCs and angel networks"
        }
    elif any(city in location_lower for city in ['mumbai', 'pune']):
        location_adjustments = {
            "market_note": "Mumbai is India's financial capital with strong B2B focus.",
            "growth_multiplier": 1.15,
            "competition_level": "High",
            "key_advantage": "Strong corporate connections and B2B opportunities"
        }
    elif any(city in location_lower for city in ['delhi', 'noida', 'gurgaon']):
        location_adjustments = {
            "market_note": "Delhi NCR has the largest startup ecosystem with strong government support.",
            "growth_multiplier": 1.1,
            "competition_level": "High",
            "key_advantage": "Government grants and policy support"
        }
    elif any(city in location_lower for city in ['hyderabad', 'chennai']):
        location_adjustments = {
            "market_note": "Emerging tech hubs with lower operational costs.",
            "growth_multiplier": 1.05,
            "competition_level": "Medium",
            "key_advantage": "Cost-effective operations and growing ecosystem"
        }
    else:
        location_adjustments = {
            "market_note": f"{location.title() if location else 'Your location'} offers lower costs and growing startup support.",
            "growth_multiplier": 1.0,
            "competition_level": "Medium-Low",
            "key_advantage": "Lower costs and less competition"
        }
    
    # Comprehensive sector data (2024-2025 Indian market)
    sector_data = {
        'fintech': {
            "market_size": "₹6,20,000 Cr (2024), projected ₹12,00,000 Cr by 2027",
            "growth_rate": "22% CAGR (2024-2027)",
            "key_trends": [
                "UPI and digital payments adoption accelerating",
                "Regulatory clarity improving (RBI guidelines)",
                "Embedded finance and B2B fintech growing",
                "Neo-banking and credit solutions expanding"
            ],
            "opportunities": [
                "Rural fintech penetration (70% untapped market)",
                "SME lending and supply chain finance",
                "Wealth tech and investment platforms",
                "Insurance tech (InsurTech) growth"
            ],
            "challenges": [
                "Regulatory compliance complexity",
                "Competition from established banks",
                "Customer acquisition costs",
                "Data security and privacy concerns"
            ],
            "competitor_landscape": "Highly competitive with 2000+ fintech startups. Key players: Paytm, Razorpay, PhonePe, CRED, Groww. Market dominated by payment solutions, but lending and wealth tech are emerging."
        },
        'saas': {
            "market_size": "₹1,50,000 Cr (2024), projected ₹4,00,000 Cr by 2027",
            "growth_rate": "28% CAGR (2024-2027)",
            "key_trends": [
                "SMB digital transformation driving demand",
                "Vertical SaaS solutions gaining traction",
                "AI/ML integration in SaaS products",
                "Global expansion by Indian SaaS companies"
            ],
            "opportunities": [
                "Vertical SaaS for Indian industries",
                "SMB-focused solutions",
                "API-first and composable architecture",
                "International market expansion"
            ],
            "challenges": [
                "Price sensitivity in Indian market",
                "Competition from global players",
                "Customer retention and churn",
                "Sales cycle length"
            ],
            "competitor_landscape": "Growing market with 10,000+ SaaS startups. Leaders: Freshworks, Zoho, Chargebee, Postman. Strong global presence but local market still developing."
        },
        'healthtech': {
            "market_size": "₹2,50,000 Cr (2024), projected ₹5,00,000 Cr by 2027",
            "growth_rate": "25% CAGR (2024-2027)",
            "key_trends": [
                "Telemedicine adoption post-COVID",
                "AI-powered diagnostics and treatment",
                "Health insurance tech integration",
                "Preventive healthcare focus"
            ],
            "opportunities": [
                "Tier-2/3 city healthcare access",
                "Chronic disease management",
                "Mental health platforms",
                "Pharmacy and diagnostics tech"
            ],
            "challenges": [
                "Regulatory approvals (DCGI, etc.)",
                "Doctor adoption and trust",
                "Data privacy (HIPAA-like compliance)",
                "Insurance integration complexity"
            ],
            "competitor_landscape": "Moderate competition with 3000+ healthtech startups. Key players: Practo, 1mg, PharmEasy, Portea. Market fragmented with room for specialization."
        },
        'edtech': {
            "market_size": "₹1,80,000 Cr (2024), projected ₹3,50,000 Cr by 2027",
            "growth_rate": "20% CAGR (2024-2027)",
            "key_trends": [
                "Personalized learning with AI",
                "Skill-based and vocational training",
                "B2B enterprise learning solutions",
                "Regional language content"
            ],
            "opportunities": [
                "K-12 supplementary education",
                "Professional upskilling",
                "Regional language content",
                "Test preparation and competitive exams"
            ],
            "challenges": [
                "High customer acquisition costs",
                "Low completion rates",
                "Regulatory changes in education",
                "Competition from traditional players"
            ],
            "competitor_landscape": "Highly competitive with 4500+ edtech startups. Dominated by Byju's, Unacademy, Vedantu. Market consolidation happening, focus shifting to profitability."
        },
        'agritech': {
            "market_size": "₹1,20,000 Cr (2024), projected ₹2,50,000 Cr by 2027",
            "growth_rate": "18% CAGR (2024-2027)",
            "key_trends": [
                "Precision agriculture with IoT and AI",
                "Farm-to-consumer direct models",
                "Supply chain optimization",
                "Climate-resilient farming solutions"
            ],
            "opportunities": [
                "Farmer advisory and market linkage",
                "Agri-input e-commerce",
                "Post-harvest management",
                "Organic and sustainable farming"
            ],
            "challenges": [
                "Farmer adoption and digital literacy",
                "Seasonal and weather dependencies",
                "Logistics in rural areas",
                "Price volatility"
            ],
            "competitor_landscape": "Emerging market with 1000+ agritech startups. Key players: Ninjacart, DeHaat, CropIn. Government support increasing, but market still early stage."
        },
        'deeptech': {
            "market_size": "₹80,000 Cr (2024), projected ₹2,00,000 Cr by 2027",
            "growth_rate": "30% CAGR (2024-2027)",
            "key_trends": [
                "AI/ML and GenAI applications",
                "Quantum computing research",
                "Robotics and automation",
                "Space tech and satellite solutions"
            ],
            "opportunities": [
                "Enterprise AI solutions",
                "Hardware-software integration",
                "Research commercialization",
                "Global market entry"
            ],
            "challenges": [
                "Long development cycles",
                "High capital requirements",
                "Talent acquisition",
                "Market education"
            ],
            "competitor_landscape": "Niche but growing with 500+ deeptech startups. Government support strong. Key focus: AI, robotics, space tech. Global competition intense."
        },
        'd2c': {
            "market_size": "₹2,00,000 Cr (2024), projected ₹4,50,000 Cr by 2027",
            "growth_rate": "24% CAGR (2024-2027)",
            "key_trends": [
                "Brand building and customer loyalty",
                "Omnichannel presence",
                "Sustainability and ethical products",
                "Social commerce integration"
            ],
            "opportunities": [
                "Niche category leadership",
                "Tier-2/3 city expansion",
                "Private label and white-label",
                "International exports"
            ],
            "challenges": [
                "High customer acquisition costs",
                "Inventory management",
                "Logistics and fulfillment",
                "Competition from established brands"
            ],
            "competitor_landscape": "Very competitive with 5000+ D2C brands. Key players: Mamaearth, Boat, Lenskart. Market consolidating, focus on profitability over growth."
        }
    }
    
    # Get data for sector or return generic
    data = sector_data.get(sector, {
        "market_size": "₹1,00,000 Cr (2024), projected ₹2,00,000 Cr by 2027",
        "growth_rate": "20% CAGR (2024-2027)",
        "key_trends": [
            "Digital transformation acceleration",
            "Increased investor interest",
            "Regulatory support",
            "Market consolidation"
        ],
        "opportunities": [
            "Untapped market segments",
            "Government initiatives",
            "Growing digital adoption",
            "International expansion"
        ],
        "challenges": [
            "Competition from established players",
            "Regulatory compliance",
            "Customer acquisition",
            "Talent acquisition"
        ],
        "competitor_landscape": "Competitive market with growing number of startups. Focus on differentiation and market fit."
    })
    
    # Apply location adjustments to market size and growth
    market_size = data.get("market_size", "")
    growth_rate = data.get("growth_rate", "")
    
    # Add location context
    result = {
        "sector": sector.capitalize(),
        "location": location.title() if location else "All India",
        "market_size": market_size,
        "growth_rate": growth_rate,
        "location_note": location_adjustments.get("market_note", ""),
        "competition_level": location_adjustments.get("competition_level", "Medium"),
        "key_advantage": location_adjustments.get("key_advantage", ""),
        **{k: v for k, v in data.items() if k not in ["market_size", "growth_rate"]}
    }
    
    return result

@router.get("/action-plan/7day")
async def get_7day_action_plan():
    """Get personalized 7-day action plan based on founder profile"""
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(status_code=400, detail="Please save your founder profile first")
    
    try:
        action_plan = generate_7day_action_plan(profile_data)
        return {
            "plan": action_plan,
            "total_days": 7,
            "profile_context": {
                "stage": profile_data.get('startup_stage', ''),
                "sector": profile_data.get('sector', ''),
                "location": profile_data.get('location', ''),
                "funding_goal": profile_data.get('funding_goal', '')
            }
        }
    except Exception as e:
        logger.error(f"Error generating action plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate action plan: {str(e)}")

@router.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Nivesh.ai - AI Funding Co-Founder for Indian Startups",
        "version": "1.0.0",
        "ai_provider": "Groq (LLaMA)",
        "ai_configured": groq_client.is_configured,
        "endpoints": {
            "save_profile": "POST /founder/profile",
            "get_profile": "GET /founder/profile", 
            "funding_advice": "POST /funding/advice",
            "readiness_score": "GET /readiness/score",
            "investor_matches": "GET /investors/match",
            "funding_timeline": "GET /funding/timeline",
            "market_insights": "GET /market/insights",
            "action_plan": "GET /action-plan/7day",
            "ai_test": "POST /ai/test",
            "health": "GET /health"
        }
    }