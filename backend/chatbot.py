import requests

def farm_chat(question):

    prompt = f"""
You are FarmGPT, an expert Indian agriculture assistant.

Rules:
- Answer only farming, crops, soil, fertilizers, irrigation, pests, diseases, weather, market prices and government agriculture schemes.
- If the question is not related to agriculture, reply:
  "I can only help with agriculture-related questions."
- Give practical advice for Indian farmers.
- Keep answers concise and farmer-friendly.

Question:
{question}
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2:3b",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]
print("chatbot.py loaded successfully")