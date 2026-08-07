from google import genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

API_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3"),
    os.getenv("GEMINI_API_KEY_4"),
    os.getenv("GEMINI_API_KEY_5")
]

print("gemini_service.py loaded")
print("API_KEYS =", API_KEYS)

def ask_gemini(image_path):

    print("ask_gemini() called")

    image = Image.open(image_path)

    prompt = """
    Your prompt here...
    """

    for key in API_KEYS:

        if not key:
            print("Empty API key found")
            continue

        try:

            print("Using key:", key[:10] + "...")

            client = genai.Client(api_key=key)

            response = client.models.generate_content(
                 model="gemini-3.5-flash",
                contents=[prompt, image]
            )

            print("Success!")
            return response.text

        except Exception as e:

            print("ERROR FOR KEY:", key[:10] + "...")
            print(str(e))
            continue

    return "All Gemini API keys failed. Please try again later."