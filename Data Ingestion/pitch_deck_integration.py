"""
pitch_deck_integration.py
Simple integration package for pitch deck analysis in any project
Easy-to-use API for analyzing pitch decks and getting funding recommendations
"""

import os
import sys
from typing import Dict, Optional

class PitchDeckAPI:
    """Simple API for pitch deck analysis and funding recommendations"""
    
    def __init__(self, groq_api_key: Optional[str] = None):
        """Initialize the pitch deck analyzer
        
        Args:
            groq_api_key: Optional API key for LLM. If not provided, uses environment variable.
        """
        if groq_api_key:
            os.environ["GROQ_API_KEY"] = groq_api_key
        
        try:
            from pitch_funding_rag import PitchFundingRAG
            self.analyzer = PitchFundingRAG()
            self.initialized = True
        except Exception as e:
            self.initialized = False
            self.error = str(e)
    
    def analyze_pitch_deck(self, pdf_path: str) -> Dict:
        """Analyze a pitch deck PDF and return comprehensive results
        
        Args:
            pdf_path: Path to the pitch deck PDF file
            
        Returns:
            Dictionary with analysis results, score, and recommendations
        """
        if not self.initialized:
            return {
                'success': False,
                'error': f'Analyzer not initialized: {self.error}'
            }
        
        if not os.path.exists(pdf_path):
            return {
                'success': False,
                'error': f'File not found: {pdf_path}'
            }
        
        try:
            result = self.analyzer.analyze_and_recommend(pdf_path)
            return result
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_quick_score(self, pdf_path: str) -> Dict:
        """Get just the score and grade for a pitch deck
        
        Args:
            pdf_path: Path to the pitch deck PDF file
            
        Returns:
            Dictionary with score, grade, and basic info
        """
        result = self.analyze_pitch_deck(pdf_path)
        
        if not result['success']:
            return result
        
        pitch = result['pitch_analysis']
        return {
            'success': True,
            'score': pitch['score'],
            'grade': pitch['grade'],
            'sections_found': pitch['sections_found'],
            'total_sections': pitch['total_sections'],
            'top_recommendations': pitch['recommendations'][:3]
        }
    
    def get_funding_recommendations(self, pdf_path: str) -> Dict:
        """Get funding recommendations based on pitch deck analysis
        
        Args:
            pdf_path: Path to the pitch deck PDF file
            
        Returns:
            Dictionary with funding types and recommendations
        """
        result = self.analyze_pitch_deck(pdf_path)
        
        if not result['success']:
            return result
        
        return {
            'success': True,
            'score': result['pitch_analysis']['score'],
            'funding_types': result['recommended_funding_types'],
            'focus_areas': result['focus_areas'],
            'preparation_advice': result['preparation_advice'],
            'next_steps': result['next_steps'][:5]
        }

# Flask API Example
def create_flask_api():
    """Create a Flask API for pitch deck analysis"""
    
    try:
        from flask import Flask, request, jsonify
        from werkzeug.utils import secure_filename
        import tempfile
    except ImportError:
        print("Flask not installed. Install with: pip install flask")
        return None
    
    app = Flask(__name__)
    analyzer = PitchDeckAPI()
    
    @app.route('/analyze-pitch-deck', methods=['POST'])
    def analyze_pitch_deck():
        """API endpoint for pitch deck analysis"""
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            
            # Analyze the pitch deck
            result = analyzer.analyze_pitch_deck(tmp_file.name)
            
            # Clean up temporary file
            os.unlink(tmp_file.name)
            
            return jsonify(result)
    
    @app.route('/quick-score', methods=['POST'])
    def quick_score():
        """API endpoint for quick pitch deck scoring"""
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            result = analyzer.get_quick_score(tmp_file.name)
            os.unlink(tmp_file.name)
            
            return jsonify(result)
    
    @app.route('/funding-recommendations', methods=['POST'])
    def funding_recommendations():
        """API endpoint for funding recommendations"""
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            result = analyzer.get_funding_recommendations(tmp_file.name)
            os.unlink(tmp_file.name)
            
            return jsonify(result)
    
    return app

# Simple usage examples
def example_usage():
    """Example usage of the pitch deck API"""
    
    # Initialize analyzer
    analyzer = PitchDeckAPI()
    
    # Example PDF path (replace with actual path)
    pdf_path = "sample_pitch_deck.pdf"
    
    if os.path.exists(pdf_path):
        # Get full analysis
        print("Full Analysis:")
        result = analyzer.analyze_pitch_deck(pdf_path)
        if result['success']:
            pitch = result['pitch_analysis']
            print(f"Score: {pitch['score']}/100 ({pitch['grade']})")
            print(f"Funding Types: {', '.join(result['recommended_funding_types'])}")
        
        # Get quick score
        print("\nQuick Score:")
        score_result = analyzer.get_quick_score(pdf_path)
        if score_result['success']:
            print(f"Score: {score_result['score']}/100")
            print(f"Top Recommendations: {score_result['top_recommendations']}")
        
        # Get funding recommendations
        print("\nFunding Recommendations:")
        funding_result = analyzer.get_funding_recommendations(pdf_path)
        if funding_result['success']:
            print(f"Recommended Funding: {', '.join(funding_result['funding_types'])}")
            print(f"Focus Areas: {', '.join(funding_result['focus_areas'])}")
    
    else:
        print(f"Sample PDF not found: {pdf_path}")

if __name__ == "__main__":
    print("Pitch Deck Analysis API")
    print("=" * 30)
    
    # Run example usage
    example_usage()
    
    # Optionally start Flask API
    print("\nTo start Flask API:")
    print("app = create_flask_api()")
    print("app.run(debug=True)")