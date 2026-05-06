"""
Funding Readiness Score Calculator
Calculates precise readiness score based on founder profile
"""

def calculate_readiness_score(profile_data: dict) -> dict:
    """
    Calculate funding readiness score (0-100) based on multiple factors
    
    Factors considered:
    1. Startup Stage (0-30 points)
    2. Sector Alignment (0-20 points)
    3. Funding Goal Match (0-20 points)
    4. Location Advantage (0-15 points)
    5. Stage-Goal Alignment (0-15 points)
    """
    
    stage = profile_data.get('startup_stage', '').lower()
    sector = profile_data.get('sector', '').lower()
    funding_goal = profile_data.get('funding_goal', '').lower()
    location = profile_data.get('location', '').lower()
    
    score = 0
    breakdown = {}
    
    # 1. Stage Score (0-30 points)
    stage_scores = {
        'idea': 15,
        'mvp': 25,
        'revenue': 35,
        'growth': 45
    }
    stage_score = stage_scores.get(stage, 20)
    score += min(stage_score, 30)
    breakdown['stage'] = min(stage_score, 30)
    
    # 2. Sector Alignment (0-20 points)
    # High-growth sectors get higher scores
    high_growth_sectors = ['fintech', 'saas', 'deeptech', 'healthtech', 'edtech']
    medium_growth_sectors = ['agritech', 'd2c', 'consumer']
    
    if sector in high_growth_sectors:
        sector_score = 18
    elif sector in medium_growth_sectors:
        sector_score = 15
    else:
        sector_score = 12
    
    score += sector_score
    breakdown['sector'] = sector_score
    
    # 3. Funding Goal Match (0-20 points)
    # Check if goal aligns with stage
    goal_scores = {
        'grant': 15,
        'angel': 18,
        'vc': 20
    }
    goal_score = goal_scores.get(funding_goal, 15)
    
    # Bonus if stage-goal alignment is good
    if stage == 'idea' and funding_goal == 'grant':
        goal_score += 2
    elif stage == 'mvp' and funding_goal == 'angel':
        goal_score += 2
    elif stage in ['revenue', 'growth'] and funding_goal == 'vc':
        goal_score += 2
    
    score += min(goal_score, 20)
    breakdown['funding_goal'] = min(goal_score, 20)
    
    # 4. Location Advantage (0-15 points)
    tier1_cities = ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'gurgaon', 'noida']
    tier2_cities = ['ahmedabad', 'kolkata', 'jaipur', 'chandigarh', 'indore', 'kochi']
    
    if any(city in location for city in tier1_cities):
        location_score = 15
    elif any(city in location for city in tier2_cities):
        location_score = 12
    else:
        location_score = 10
    
    score += location_score
    breakdown['location'] = location_score
    
    # 5. Stage-Goal Alignment Bonus (0-15 points)
    alignment_bonus = 0
    if (stage == 'idea' and funding_goal in ['grant', 'angel']) or \
       (stage == 'mvp' and funding_goal == 'angel') or \
       (stage in ['revenue', 'growth'] and funding_goal == 'vc'):
        alignment_bonus = 12
    elif (stage == 'mvp' and funding_goal == 'grant') or \
         (stage == 'revenue' and funding_goal == 'angel'):
        alignment_bonus = 8
    else:
        alignment_bonus = 5
    
    score += alignment_bonus
    breakdown['alignment'] = alignment_bonus
    
    # Cap at 100
    final_score = min(round(score), 100)
    
    # Determine confidence level
    if final_score >= 80:
        confidence = "High Confidence"
        badge_color = "green"
    elif final_score >= 60:
        confidence = "Medium Confidence"
        badge_color = "yellow"
    else:
        confidence = "Low Confidence"
        badge_color = "red"
    
    return {
        "score": final_score,
        "confidence": confidence,
        "badge_color": badge_color,
        "breakdown": breakdown,
        "max_score": 100
    }

