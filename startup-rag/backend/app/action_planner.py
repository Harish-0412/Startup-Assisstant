"""
7-Day Action Plan Generator
Creates personalized, actionable 7-day plans based on founder profile
"""

def generate_7day_action_plan(profile_data: dict) -> list:
    """
    Generate a personalized 7-day action plan based on:
    - Startup stage
    - Sector
    - Location
    - Funding goal
    - Current readiness
    """
    stage = profile_data.get('startup_stage', '').lower()
    sector = profile_data.get('sector', '').lower()
    location = profile_data.get('location', '').lower()
    funding_goal = profile_data.get('funding_goal', '').lower()
    
    # Base tasks for all startups
    base_tasks = [
        "Review and update your pitch deck with latest metrics",
        "Prepare a 12-month financial projection spreadsheet",
        "Update your LinkedIn and professional profiles"
    ]
    
    # Stage-specific tasks
    stage_tasks = {
        'idea': [
            "Create a detailed problem-solution fit document",
            "Conduct 20 customer interviews to validate idea",
            "Build a basic MVP or prototype",
            "Research 5 direct competitors and their funding history",
            "Create a one-page executive summary"
        ],
        'mvp': [
            "Document your first 10 paying customers and their feedback",
            "Calculate your Customer Acquisition Cost (CAC) and Lifetime Value (LTV)",
            "Prepare a product demo video (2-3 minutes)",
            "Set up basic analytics and tracking (Google Analytics, etc.)",
            "Create a go-to-market strategy document"
        ],
        'revenue': [
            "Prepare monthly revenue growth charts (last 6 months)",
            "Document your unit economics and profitability metrics",
            "Create a competitive analysis with market positioning",
            "Prepare investor pitch deck with financial models",
            "List 10 potential investors to approach"
        ],
        'growth': [
            "Prepare Series A pitch deck with scaling plans",
            "Document market expansion strategy",
            "Prepare detailed financial projections (3 years)",
            "Create a list of strategic partnerships to pursue",
            "Prepare for due diligence with all legal documents"
        ]
    }
    
    # Sector-specific tasks
    sector_tasks = {
        'fintech': [
            "Ensure RBI compliance and regulatory documentation",
            "Prepare security and data privacy compliance certificates",
            "Research fintech-specific investor networks"
        ],
        'saas': [
            "Calculate MRR, ARR, and churn rate metrics",
            "Prepare customer case studies and testimonials",
            "Document your tech stack and architecture"
        ],
        'healthtech': [
            "Ensure medical device/software regulatory compliance",
            "Prepare clinical validation data if applicable",
            "Research healthcare-specific grants and investors"
        ],
        'edtech': [
            "Prepare student/user engagement metrics",
            "Document curriculum and content quality standards",
            "Research education sector-specific funding programs"
        ],
        'agritech': [
            "Document farmer/user testimonials and impact stories",
            "Prepare agricultural impact metrics",
            "Research government agricultural schemes and grants"
        ]
    }
    
    # Location-specific tasks
    location_tasks = []
    if any(city in location for city in ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai']):
        location_tasks = [
            "Attend a local startup networking event this week",
            "Research local incubators and accelerators in your city",
            "Connect with 3 local founders in your sector on LinkedIn"
        ]
    else:
        location_tasks = [
            "Join virtual startup communities and pitch sessions",
            "Research remote-friendly investors and angel networks",
            "Set up virtual meeting capabilities for investor pitches"
        ]
    
    # Funding goal-specific tasks
    goal_tasks = {
        'grant': [
            "Research 5 government grant programs matching your sector",
            "Prepare grant application documents and eligibility proof",
            "Attend a government startup scheme webinar or event"
        ],
        'angel': [
            "Create a list of 10 angel networks to approach",
            "Prepare a 5-minute elevator pitch",
            "Research angel investors who invested in similar startups"
        ],
        'vc': [
            "Prepare detailed financial models and projections",
            "Create a list of 15 VCs that invest in your stage and sector",
            "Prepare for Series A pitch with market size analysis (TAM/SAM/SOM)"
        ]
    }
    
    # Combine all tasks
    all_tasks = []
    
    # Add base tasks (3)
    all_tasks.extend(base_tasks)
    
    # Add stage-specific tasks (5)
    stage_specific = stage_tasks.get(stage, stage_tasks['mvp'])
    all_tasks.extend(stage_specific[:3])  # Top 3 from stage
    
    # Add sector-specific tasks (2)
    sector_specific = sector_tasks.get(sector, [])
    all_tasks.extend(sector_specific[:2])
    
    # Add location-specific tasks (2)
    all_tasks.extend(location_tasks[:2])
    
    # Add funding goal-specific tasks (2)
    goal_specific = goal_tasks.get(funding_goal, goal_tasks['angel'])
    all_tasks.extend(goal_specific[:2])
    
    # Ensure we have exactly 7 tasks (prioritize and trim)
    prioritized_tasks = all_tasks[:7]
    
    # Add day labels
    days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
    action_plan = [
        {
            "day": days[i],
            "task": task,
            "priority": "High" if i < 3 else "Medium" if i < 5 else "Standard",
            "category": get_task_category(task, stage, sector, funding_goal)
        }
        for i, task in enumerate(prioritized_tasks)
    ]
    
    return action_plan

def get_task_category(task: str, stage: str, sector: str, goal: str) -> str:
    """Categorize task for better organization"""
    task_lower = task.lower()
    
    if any(word in task_lower for word in ['pitch', 'deck', 'investor', 'vc', 'angel']):
        return "Pitch Preparation"
    elif any(word in task_lower for word in ['financial', 'revenue', 'cac', 'ltv', 'projection']):
        return "Financial Planning"
    elif any(word in task_lower for word in ['compliance', 'regulatory', 'legal']):
        return "Compliance"
    elif any(word in task_lower for word in ['customer', 'user', 'interview', 'feedback']):
        return "Customer Validation"
    elif any(word in task_lower for word in ['research', 'competitor', 'market']):
        return "Market Research"
    elif any(word in task_lower for word in ['network', 'connect', 'event', 'meeting']):
        return "Networking"
    else:
        return "General"





