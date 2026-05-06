"""
Groq LLM Client for Funding Advice Generation
"""

import os
import json
import logging
import requests
from app.config import GROQ_API_KEY, GROQ_MODEL

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

FALLBACK_KEY = "your_groq_api_key_here"
BEST_MODEL   = "llama-3.3-70b-versatile"


class GroqClient:
    def __init__(self):
        self.api_key  = GROQ_API_KEY or FALLBACK_KEY
        self.model    = BEST_MODEL
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.is_configured = bool(self.api_key)
        if self.is_configured:
            logger.info(f"Groq client ready — model: {self.model}")
        else:
            logger.warning("Groq API key not set.")

    def _call(self, messages: list, max_tokens: int = 2000, temperature: float = 0.4) -> str:
        resp = requests.post(
            self.base_url,
            headers={"Authorization": f"Bearer {self.api_key}",
                     "Content-Type": "application/json"},
            json={"model": self.model, "messages": messages,
                  "temperature": temperature, "max_tokens": max_tokens},
            timeout=30,
        )
        if resp.status_code != 200:
            raise ValueError(f"Groq API {resp.status_code}: {resp.text[:300]}")
        return resp.json()["choices"][0]["message"]["content"].strip()

    def generate_funding_advice(self, prompt: str) -> dict:
        if not self.is_configured:
            raise ValueError("Groq not configured.")
        messages = [
            {"role": "system",
             "content": "You are an expert Indian startup funding advisor. Respond with valid JSON only, no markdown."},
            {"role": "user", "content": prompt},
        ]
        response_text = self._call(messages)
        # Extract JSON
        if "```json" in response_text:
            s = response_text.find("```json") + 7
            e = response_text.find("```", s)
            json_text = response_text[s:e].strip()
        elif "{" in response_text:
            s = response_text.find("{")
            e = response_text.rfind("}") + 1
            json_text = response_text[s:e]
        else:
            json_text = response_text
        return json.loads(json_text)

    def test_generation(self, prompt: str) -> str:
        if not self.is_configured:
            raise ValueError("Groq not configured.")
        return self._call([
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user",   "content": prompt},
        ])


groq_client = GroqClient()
