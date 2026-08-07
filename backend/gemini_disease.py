import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()


API_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3"),
    os.getenv("GEMINI_API_KEY_4"),
    os.getenv("GEMINI_API_KEY_5"),
     os.getenv("GEMINI_API_KEY_6"),
    os.getenv("GEMINI_API_KEY_7"),
    os.getenv("GEMINI_API_KEY_8"),
    os.getenv("GEMINI_API_KEY_9"),
    os.getenv("GEMINI_API_KEY_10")
]


model = genai.GenerativeModel(
    "gemini-1.5-flash"
)


def ask_gemini(image_path):

    image = Image.open(image_path)

    prompt = """
Return ONLY in the exact format below.

Plant Name: <name>

Disease Name: <name>

Treatment: <1 short line>

Precautions:
- <point 1>
- <point 2>
- <point 3>

Medicine: <medicine name>

Rules:
- Do NOT include symptoms.
- Do NOT include causes.
- Do NOT include confidence.
- Do NOT include disease description.
- Do NOT include management details.
- Do NOT include markdown headings.
- Maximum 50 words total.
- If healthy, write:
  Disease Name: Healthy Plant
- If not a plant leaf image, reply only:
  Not a plant leaf image
"""

    for key in API_KEYS:

        try:

            client = genai.Client(api_key=key)

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[prompt, image]
            )

            return response.text

        except Exception as e:

            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f"Quota exceeded. Switching key...")
                continue

            print("Gemini Error:", e)

    return "All Gemini API keys have reached their limits."