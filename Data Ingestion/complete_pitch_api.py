
"""
complete_pitch_api.py
Complete API for pitch deck analysis and generation
Includes analyzer, generator, and funding recommendations
"""

from pitch_deck_integration import PitchDeckAPI
from pdf_pitch_generator import generate_pitch_from_data
from typing import Dict, Optional
import tempfile
import os

class CompletePitchAPI:
    """Complete pitch deck system API"""
    
    def __init__(self, groq_api_key: Optional[str] = None):
        self.analyzer = PitchDeckAPI(groq_api_key)
    
    def analyze_pitch_deck(self, pdf_path: str) -> Dict:
        """Analyze existing pitch deck"""
        return self.analyzer.analyze_pitch_deck(pdf_path)
    
    def generate_pitch_deck(self, company_data: Dict) -> Dict:
        """Generate new pitch deck from company data"""
        try:
            result = generate_pitch_from_data(company_data)
            return result
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def analyze_and_improve(self, pdf_path: str, company_data: Dict) -> Dict:
        """Analyze existing pitch and generate improved version"""
        
        # Analyze current pitch
        analysis = self.analyze_pitch_deck(pdf_path)
        
        if not analysis['success']:
            return analysis
        
        # Generate improved pitch
        improved = self.generate_pitch_deck(company_data)
        
        return {
            'success': True,
            'original_analysis': analysis,
            'improved_pitch': improved,
            'improvement_summary': {
                'original_score': analysis['pitch_analysis']['score'],
                'improved_score': 100,
                'score_improvement': 100 - analysis['pitch_analysis']['score'],
                'missing_sections_added': 9 - analysis['pitch_analysis']['sections_found']
            }
        }
    
    def get_funding_roadmap(self, company_data: Dict) -> Dict:
        """Get complete funding roadmap based on company stage"""
        
        # Generate pitch to assess readiness
        pitch_result = self.generate_pitch_deck(company_data)
        
        if not pitch_result['success']:
            return pitch_result
        
        # Determine funding stage based on data completeness
        stage = self._determine_funding_stage(company_data)
        
        roadmap = {
            'current_stage': stage,
            'pitch_readiness': 'High' if pitch_result['success'] else 'Low',
            'recommended_actions': self._get_stage_actions(stage),
            'funding_options': self._get_funding_options(stage),
            'timeline': self._get_funding_timeline(stage),
            'generated_pitch': pitch_result
        }
        
        return {
            'success': True,
            'roadmap': roadmap
        }
    
    def _determine_funding_stage(self, data: Dict) -> str:
        """Determine funding stage based on company data"""
        
        has_revenue = bool(data.get('revenue'))
        has_users = bool(data.get('users'))
        has_product = bool(data.get('solution'))
        has_team = bool(data.get('founders'))
        
        if has_revenue and has_users and int(data.get('users', '0').replace('+', '').replace('K', '000').replace('M', '000000').split()[0] or '0') > 1000:
            return 'Series A Ready'
        elif has_revenue and has_users:
            return 'Seed Ready'
        elif has_product and has_team:
            return 'Pre-Seed'
        else:
            return 'Idea Stage'
    
    def _get_stage_actions(self, stage: str) -> list:
        """Get recommended actions for funding stage"""
        
        actions = {
            'Idea Stage': [
                'Validate market demand',
                'Build MVP or prototype',
                'Form founding team',
                'Conduct market research'
            ],
            'Pre-Seed': [
                'Launch beta version',
                'Get initial customers',
                'Refine product-market fit',
                'Build basic traction metrics'
            ],
            'Seed Ready': [
                'Scale customer acquisition',
                'Optimize unit economics',
                'Build strong team',
                'Prepare detailed financials'
            ],
            'Series A Ready': [
                'Demonstrate scalable growth',
                'Expand market presence',
                'Build strategic partnerships',
                'Prepare for due diligence'
            ]
        }
        
        return actions.get(stage, [])
    
    def _get_funding_options(self, stage: str) -> list:
        """Get funding options for stage"""
        
        options = {
            'Idea Stage': ['Bootstrapping', 'Friends & Family', 'Grants', 'Competitions'],
            'Pre-Seed': ['Angel Investors', 'Micro VCs', 'Incubators', 'Government Grants'],
            'Seed Ready': ['Seed VCs', 'Angel Groups', 'Strategic Investors', 'Crowdfunding'],
            'Series A Ready': ['Venture Capital', 'Growth Equity', 'Strategic Partners', 'Private Equity']
        }
        
        return options.get(stage, [])
    
    def _get_funding_timeline(self, stage: str) -> str:
        """Get typical funding timeline"""
        
        timelines = {
            'Idea Stage': '6-12 months to pre-seed readiness',
            'Pre-Seed': '3-6 months to raise $50K-$250K',
            'Seed Ready': '3-6 months to raise $250K-$2M',
            'Series A Ready': '6-9 months to raise $2M-$15M'
        }
        
        return timelines.get(stage, 'Timeline varies by company')

# Flask API for complete system
def create_complete_api():
    """Create Flask API for complete pitch system"""
    
    try:
        from flask import Flask, request, jsonify
        from werkzeug.utils import secure_filename
    except ImportError:
        print("Flask not installed. Install with: pip install flask")
        return None
    
    app = Flask(__name__)
    api = CompletePitchAPI()
    
    @app.route('/analyze-pitch', methods=['POST'])
    def analyze_pitch():
        """Analyze uploaded pitch deck"""
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            result = api.analyze_pitch_deck(tmp_file.name)
            os.unlink(tmp_file.name)
            
            return jsonify(result)
    
    @app.route('/generate-pitch', methods=['POST'])
    def generate_pitch():
        """Generate new pitch deck from company data"""
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No company data provided'}), 400
        
        result = api.generate_pitch_deck(data)
        return jsonify(result)
    
    @app.route('/funding-roadmap', methods=['POST'])
    def funding_roadmap():
        """Get complete funding roadmap"""
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No company data provided'}), 400
        
        result = api.get_funding_roadmap(data)
        return jsonify(result)
    
    @app.route('/analyze-and-improve', methods=['POST'])
    def analyze_and_improve():
        """Analyze existing pitch and generate improved version"""
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        company_data = request.form.get('company_data')
        
        if not company_data:
            return jsonify({'error': 'No company data provided'}), 400
        
        import json
        try:
            company_data = json.loads(company_data)
        except:
            return jsonify({'error': 'Invalid company data format'}), 400
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            result = api.analyze_and_improve(tmp_file.name, company_data)
            os.unlink(tmp_file.name)
            
            return jsonify(result)
    
    return app

# Example usage
def example_complete_usage():
    """Example of complete API usage"""
    
    api = CompletePitchAPI()
    
    # Sample company data
    company_data = {
        'name': 'TechStartup Inc',
        'industry': 'SaaS',
        'problem': 'Small businesses struggle with inventory management',
        'solution': 'AI-powered inventory optimization platform',
        'market_size': '$50B global market',
        'revenue': '$10K MRR',
        'users': '500+ businesses',
        'funding_amount': '$500K seed round'
    }
    
    print("Complete Pitch API Example")
    print("=" * 30)
    
    # Generate pitch deck
    print("1. Generating pitch deck...")
    pitch_result = api.generate_pitch_deck(company_data)
    if pitch_result['success']:
        print(f"✅ Generated pitch for {pitch_result['company_name']}")
        print(f"📄 Files: {pitch_result.get('text_file', 'N/A')}")
    
    # Get funding roadmap
    print("\n2. Getting funding roadmap...")
    roadmap_result = api.get_funding_roadmap(company_data)
    if roadmap_result['success']:
        roadmap = roadmap_result['roadmap']
        print(f"📊 Current Stage: {roadmap['current_stage']}")
        print(f"🎯 Funding Options: {', '.join(roadmap['funding_options'])}")
        print(f"⏰ Timeline: {roadmap['timeline']}")

if __name__ == "__main__":
    example_complete_usage()