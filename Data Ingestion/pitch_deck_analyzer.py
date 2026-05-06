"""
pitch_deck_analyzer.py
AI-powered pitch deck analysis and scoring system
Analyzes pitch decks and provides improvement recommendations
"""

import re
from typing import Dict, List, Tuple
from ingestion.pdf_loader import load_pdf
from ingestion.cleaner import normalize_text

class PitchDeckAnalyzer:
    def __init__(self):
        # Essential pitch deck sections
        self.required_sections = {
            'problem': ['problem', 'pain point', 'challenge', 'issue'],
            'solution': ['solution', 'product', 'service', 'approach'],
            'market': ['market', 'tam', 'addressable market', 'market size'],
            'business_model': ['business model', 'revenue', 'monetization', 'pricing'],
            'traction': ['traction', 'growth', 'customers', 'revenue', 'metrics'],
            'competition': ['competition', 'competitive', 'competitors', 'landscape'],
            'team': ['team', 'founder', 'co-founder', 'leadership', 'experience'],
            'financials': ['financial', 'projection', 'forecast', 'budget', 'funding'],
            'funding': ['funding', 'investment', 'raise', 'capital', 'valuation']
        }
        
        # Scoring weights
        self.section_weights = {
            'problem': 15,
            'solution': 20,
            'market': 15,
            'business_model': 15,
            'traction': 10,
            'competition': 5,
            'team': 10,
            'financials': 5,
            'funding': 5
        }
    
    def analyze_pitch_deck(self, pdf_path: str) -> Dict:
        """Analyze a pitch deck PDF and return comprehensive analysis"""
        
        # Extract content from PDF
        pdf_data = load_pdf(pdf_path)
        raw_text = pdf_data['full_text']
        
        # Clean text
        cleaned = normalize_text(raw_text, mode="basic")
        clean_text = cleaned['clean_text']
        
        # Analyze sections
        section_analysis = self._analyze_sections(clean_text)
        
        # Calculate overall score
        overall_score = self._calculate_score(section_analysis)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(section_analysis)
        
        # Extract key metrics
        metrics = self._extract_metrics(clean_text)
        
        return {
            'overall_score': overall_score,
            'section_scores': section_analysis,
            'recommendations': recommendations,
            'metrics': metrics,
            'total_pages': len(pdf_data['pages']),
            'word_count': len(clean_text.split())
        }
    
    def _analyze_sections(self, text: str) -> Dict:
        """Analyze presence and quality of each section"""
        
        text_lower = text.lower()
        section_scores = {}
        
        for section, keywords in self.required_sections.items():
            # Check if section is present
            section_present = any(keyword in text_lower for keyword in keywords)
            
            if section_present:
                # Calculate section quality score
                quality_score = self._calculate_section_quality(text_lower, keywords, section)
                section_scores[section] = {
                    'present': True,
                    'quality_score': quality_score,
                    'weight': self.section_weights[section]
                }
            else:
                section_scores[section] = {
                    'present': False,
                    'quality_score': 0,
                    'weight': self.section_weights[section]
                }
        
        return section_scores
    
    def _calculate_section_quality(self, text: str, keywords: List[str], section: str) -> float:
        """Calculate quality score for a specific section"""
        
        # Count keyword occurrences
        keyword_count = sum(text.count(keyword) for keyword in keywords)
        
        # Section-specific quality checks
        quality_factors = []
        
        if section == 'problem':
            # Look for problem indicators
            problem_indicators = ['pain', 'difficult', 'challenge', 'struggle', 'inefficient']
            quality_factors.append(sum(1 for indicator in problem_indicators if indicator in text))
        
        elif section == 'solution':
            # Look for solution indicators
            solution_indicators = ['solve', 'address', 'improve', 'optimize', 'innovative']
            quality_factors.append(sum(1 for indicator in solution_indicators if indicator in text))
        
        elif section == 'market':
            # Look for market size indicators
            market_indicators = ['billion', 'million', 'tam', 'sam', 'som', 'cagr']
            quality_factors.append(sum(1 for indicator in market_indicators if indicator in text))
        
        elif section == 'traction':
            # Look for traction metrics
            traction_indicators = ['users', 'customers', 'revenue', 'growth', '%', 'mrr', 'arr']
            quality_factors.append(sum(1 for indicator in traction_indicators if indicator in text))
        
        # Calculate quality score (0-1)
        base_score = min(keyword_count / 3, 1.0)  # Normalize keyword count
        quality_bonus = min(sum(quality_factors) / 10, 0.5)  # Quality indicators bonus
        
        return min(base_score + quality_bonus, 1.0)
    
    def _calculate_score(self, section_analysis: Dict) -> float:
        """Calculate overall pitch deck score (0-100)"""
        
        total_weighted_score = 0
        total_weight = 0
        
        for section, data in section_analysis.items():
            if data['present']:
                section_score = data['quality_score'] * data['weight']
                total_weighted_score += section_score
            total_weight += data['weight']
        
        return round((total_weighted_score / total_weight) * 100, 1)
    
    def _generate_recommendations(self, section_analysis: Dict) -> List[str]:
        """Generate specific recommendations for improvement"""
        
        recommendations = []
        
        for section, data in section_analysis.items():
            if not data['present']:
                recommendations.append(f"ADD {section.upper()}: Include a dedicated {section.replace('_', ' ')} section")
            elif data['quality_score'] < 0.5:
                recommendations.append(f"IMPROVE {section.upper()}: Enhance {section.replace('_', ' ')} with more details")
        
        # General recommendations based on score
        missing_sections = [s for s, d in section_analysis.items() if not d['present']]
        
        if len(missing_sections) > 3:
            recommendations.insert(0, "CRITICAL: Too many missing sections - focus on core elements first")
        
        # Add specific improvement suggestions
        if not section_analysis['traction']['present']:
            recommendations.append("TRACTION: Add customer testimonials, usage metrics, or revenue data")
        
        if not section_analysis['market']['present']:
            recommendations.append("MARKET: Include TAM/SAM/SOM analysis and market research")
        
        if section_analysis['team']['quality_score'] < 0.5:
            recommendations.append("TEAM: Highlight relevant experience and expertise of founders")
        
        return recommendations[:8]  # Limit to top 8 recommendations
    
    def _extract_metrics(self, text: str) -> Dict:
        """Extract key metrics from pitch deck"""
        
        # Extract funding amounts
        funding_patterns = [
            r'(\$\d+(?:,\d+)*(?:\.\d+)?)\s*(million|billion|k)?',
            r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(million|billion)?\s*dollars?'
        ]
        
        funding_amounts = []
        for pattern in funding_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            funding_amounts.extend([f"{m[0]} {m[1]}".strip() for m in matches])
        
        # Extract percentages (growth, market share, etc.)
        percentages = re.findall(r'(\d+(?:\.\d+)?%)', text)
        
        # Extract user/customer numbers
        user_patterns = [
            r'(\d+(?:,\d+)*)\s*(?:users?|customers?|clients?)',
            r'(\d+(?:,\d+)*)\s*(?:million|thousand|k)\s*(?:users?|customers?)'
        ]
        
        user_numbers = []
        for pattern in user_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            user_numbers.extend(matches)
        
        return {
            'funding_amounts': funding_amounts[:5],
            'growth_percentages': percentages[:5],
            'user_numbers': user_numbers[:3]
        }

def analyze_user_pitch_deck(pdf_path: str) -> Dict:
    """Main function to analyze user's pitch deck"""
    
    analyzer = PitchDeckAnalyzer()
    
    try:
        analysis = analyzer.analyze_pitch_deck(pdf_path)
        
        # Format results for display
        result = {
            'success': True,
            'score': analysis['overall_score'],
            'grade': _get_grade(analysis['overall_score']),
            'sections_found': sum(1 for s in analysis['section_scores'].values() if s['present']),
            'total_sections': len(analysis['section_scores']),
            'recommendations': analysis['recommendations'],
            'metrics': analysis['metrics'],
            'details': {
                'pages': analysis['total_pages'],
                'words': analysis['word_count'],
                'section_breakdown': analysis['section_scores']
            }
        }
        
        return result
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def _get_grade(score: float) -> str:
    """Convert score to letter grade"""
    if score >= 90: return 'A+'
    elif score >= 85: return 'A'
    elif score >= 80: return 'A-'
    elif score >= 75: return 'B+'
    elif score >= 70: return 'B'
    elif score >= 65: return 'B-'
    elif score >= 60: return 'C+'
    elif score >= 55: return 'C'
    elif score >= 50: return 'C-'
    else: return 'D'

if __name__ == "__main__":
    # Test with a sample pitch deck
    test_path = "data/raw/sample_pitch_deck.pdf"  # Replace with actual path
    
    result = analyze_user_pitch_deck(test_path)
    
    if result['success']:
        print(f"Pitch Deck Score: {result['score']}/100 ({result['grade']})")
        print(f"Sections Found: {result['sections_found']}/{result['total_sections']}")
        print("\nRecommendations:")
        for i, rec in enumerate(result['recommendations'], 1):
            print(f"{i}. {rec}")
    else:
        print(f"Analysis failed: {result['error']}")