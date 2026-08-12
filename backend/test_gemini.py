from google import genai
from dotenv import load_dotenv
import os

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
    os.getenv("GEMINI_API_KEY_10"),
]

print("\n========== GEMINI KEY TEST ==========\n")

for i, key in enumerate(API_KEYS, start=1):

    print(f"--- Testing KEY {i} ---")

    if not key:
        print("NOT LOADED\n")
        continue

    print("Loaded:", True)
    print("Starts:", key[:10] + "...")

    try:
        client = genai.Client(api_key=key)

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents="Say hello"
        )

        print("STATUS: SUCCESS")
        print("Response:", response.text)
        print()

    except Exception as e:
        print("STATUS: FAILED")
        print("Error type:", type(e).__name__)
        print("Error:", str(e))
        print()

print("========== TEST COMPLETE ==========")