"""
pitch_funding_rag.py
Enhanced RAG system that analyzes pitch decks and provides funding recommendations
Combines pitch deck scoring with funding database knowledge
"""

from funding_rag_engine import FundingRAGEngine
from pitch_deck_analyzer import analyze_user_pitch_deck
from typing import Dict, List
import os

class PitchFundingRAG:
    def __init__(self):
        self.funding_engine = FundingRAGEngine()
        
        # Funding recommendation templates based on pitch deck score
        self.funding_recommendations = {
            'high_score': {  # 80+ score
                'funding_types': ['Series A', 'Venture Capital', 'Angel Investment'],
                'focus_areas': ['scaling', 'market expansion', 'team growth'],
                'preparation': 'Your pitch deck is strong. Focus on traction metrics and financial projections.'
            },
            'medium_score': {  # 60-79 score
                'funding_types': ['Seed Funding', 'Angel Investment', 'Government Grants'],
                'focus_areas': ['product development', 'market validation', 'team building'],
                'preparation': 'Strengthen your pitch deck before approaching major investors.'
            },
            'low_score': {  # Below 60
                'funding_types': ['Bootstrapping', 'Government Grants', 'Incubator Programs'],
                'focus_areas': ['MVP development', 'market research', 'business model validation'],
                'preparation': 'Focus on improving your pitch deck and validating your business model first.'
            }
        }
    
    def analyze_and_recommend(self, pdf_path: str) -> Dict:
        """Analyze pitch deck and provide comprehensive funding recommendations"""
        
        # Step 1: Analyze pitch deck
        pitch_analysis = analyze_user_pitch_deck(pdf_path)
        
        if not pitch_analysis['success']:
            return {
                'success': False,
                'error': f"Pitch deck analysis failed: {pitch_analysis['error']}"
            }
        
        # Step 2: Get funding category based on score
        score = pitch_analysis['score']
        funding_category = self._get_funding_category(score)
        
        # Step 3: Generate funding-specific questions
        funding_questions = self._generate_funding_questions(pitch_analysis, funding_category)
        
        # Step 4: Get RAG responses for funding questions
        funding_responses = {}
        for question_type, question in funding_questions.items():
            try:
                response = self.funding_engine.ask_funding_question(question, debug=False)
                funding_responses[question_type] = {
                    'answer': response['answer'],
                    'funding_details': response.get('funding_details', {}),
                    'sources': len(response.get('references', []))
                }
            except Exception as e:
                funding_responses[question_type] = {'error': str(e)}
        
        # Step 5: Combine analysis with recommendations
        comprehensive_result = {
            'success': True,
            'pitch_analysis': pitch_analysis,
            'funding_category': funding_category,
            'recommended_funding_types': self.funding_recommendations[funding_category]['funding_types'],
            'focus_areas': self.funding_recommendations[funding_category]['focus_areas'],
            'preparation_advice': self.funding_recommendations[funding_category]['preparation'],
            'funding_information': funding_responses,
            'next_steps': self._generate_next_steps(pitch_analysis, funding_category)
        }
        
        return comprehensive_result
    
    def _get_funding_category(self, score: float) -> str:
        """Determine funding category based on pitch deck score"""
        if score >= 80:
            return 'high_score'
        elif score >= 60:
            return 'medium_score'
        else:
            return 'low_score'
    
    def _generate_funding_questions(self, pitch_analysis: Dict, category: str) -> Dict[str, str]:
        """Generate relevant funding questions based on pitch analysis"""
        
        questions = {}
        
        # Base questions for all categories
        questions['general_funding'] = "What startup funding options are available in India?"
        
        # Category-specific questions
        if category == 'high_score':
            questions['series_a'] = "What are the requirements for Series A funding?"
            questions['vc_funding'] = "How to approach venture capital firms for funding?"
            questions['scaling'] = "What funding is available for scaling startups?"
        
        elif category == 'medium_score':
            questions['seed_funding'] = "What are seed funding options for startups?"
            questions['angel_investment'] = "How to find angel investors for startups?"
            questions['government_grants'] = "What government grants are available for startups?"
        
        else:  # low_score
            questions['bootstrap'] = "How to bootstrap a startup with minimal funding?"
            questions['incubators'] = "What startup incubator programs are available?"
            questions['grants'] = "What grants are available for early-stage startups?"
        
        # Add section-specific questions based on missing elements
        missing_sections = [s for s, d in pitch_analysis['details']['section_breakdown'].items() 
                          if not d['present']]
        
        if 'traction' in missing_sections:
            questions['traction_funding'] = "What funding is available for startups without traction?"
        
        if 'market' in missing_sections:
            questions['market_research'] = "How to conduct market research for funding applications?"
        
        return questions
    
    def _generate_next_steps(self, pitch_analysis: Dict, category: str) -> List[str]:
        """Generate actionable next steps"""
        
        next_steps = []
        
        # Steps based on pitch deck recommendations
        recommendations = pitch_analysis['recommendations']
        
        if recommendations:
            next_steps.append("IMPROVE PITCH DECK:")
            next_steps.extend([f"  • {rec}" for rec in recommendations[:3]])
        
        # Steps based on funding category
        if category == 'high_score':
            next_steps.extend([
                "FUNDING PREPARATION:",
                "  • Prepare detailed financial projections",
                "  • Compile traction metrics and KPIs",
                "  • Research target VC firms",
                "  • Practice investor presentations"
            ])
        
        elif category == 'medium_score':
            next_steps.extend([
                "STRENGTHEN FOUNDATION:",
                "  • Validate business model",
                "  • Build MVP or improve product",
                "  • Gather customer feedback",
                "  • Apply for government grants"
            ])
        
        else:  # low_score
            next_steps.extend([
                "BUILD FUNDAMENTALS:",
                "  • Conduct thorough market research",
                "  • Develop clear value proposition",
                "  • Create detailed business plan",
                "  • Consider incubator programs"
            ])
        
        return next_steps
    
    def quick_pitch_analysis(self, pdf_path: str) -> str:
        """Quick analysis for simple integration"""
        
        result = self.analyze_and_recommend(pdf_path)
        
        if not result['success']:
            return f"Analysis failed: {result['error']}"
        
        pitch = result['pitch_analysis']
        
        summary = f"""
PITCH DECK ANALYSIS SUMMARY
Score: {pitch['score']}/100 ({pitch['grade']})
Sections: {pitch['sections_found']}/{pitch['total_sections']} complete

RECOMMENDED FUNDING: {', '.join(result['recommended_funding_types'])}

TOP IMPROVEMENTS:
{chr(10).join([f"• {rec}" for rec in pitch['recommendations'][:3]])}

NEXT STEPS:
{chr(10).join(result['next_steps'][:5])}
"""
        return summary

def create_pitch_funding_assistant():
    """Interactive assistant for pitch deck analysis and funding recommendations"""
    
    assistant = PitchFundingRAG()
    
    print("🎯 Pitch Deck Analyzer & Funding Recommender")
    print("=" * 50)
    print("Upload your pitch deck PDF for analysis and funding recommendations")
    print("Type 'exit' to quit\n")
    
    while True:
        pdf_path = input("📄 Enter pitch deck PDF path (or 'exit'): ").strip()
        
        if pdf_path.lower() in ['exit', 'quit', 'q']:
            print("👋 Goodbye!")
            break
        
        if not pdf_path or not os.path.exists(pdf_path):
            print("❌ File not found. Please enter a valid PDF path.\n")
            continue
        
        try:
            print("\n🔍 Analyzing pitch deck...")
            result = assistant.analyze_and_recommend(pdf_path)
            
            if result['success']:
                pitch = result['pitch_analysis']
                
                print(f"\n📊 PITCH DECK SCORE: {pitch['score']}/100 ({pitch['grade']})")
                print(f"📋 Sections Found: {pitch['sections_found']}/{pitch['total_sections']}")
                
                print(f"\n💰 RECOMMENDED FUNDING:")
                for funding_type in result['recommended_funding_types']:
                    print(f"  • {funding_type}")
                
                print(f"\n🎯 FOCUS AREAS:")
                for area in result['focus_areas']:
                    print(f"  • {area}")
                
                print(f"\n📝 TOP RECOMMENDATIONS:")
                for i, rec in enumerate(pitch['recommendations'][:5], 1):
                    print(f"  {i}. {rec}")
                
                print(f"\n🚀 NEXT STEPS:")
                for step in result['next_steps'][:5]:
                    print(f"  {step}")
                
                print("\n" + "="*50)
            
            else:
                print(f"❌ Analysis failed: {result['error']}")
        
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print()

if __name__ == "__main__":
    create_pitch_funding_assistant()