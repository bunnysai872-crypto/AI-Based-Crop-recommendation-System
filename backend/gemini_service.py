import os
from PIL import Image
from google import genai


# ============================================================
# GEMINI API KEYS
# ============================================================

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

API_KEYS = [key.strip() for key in API_KEYS if key and key.strip()]


# ============================================================
# MODEL
# ============================================================

GEMINI_MODEL = "gemini-2.5-flash"


# ============================================================
# STARTUP TEST
# ============================================================

print("\n========== GEMINI SERVICE ==========", flush=True)

for index, key in enumerate(API_KEYS, start=1):
    print(f"KEY {index}: LOADED", flush=True)

print("====================================\n", flush=True)


# ============================================================
# ASK GEMINI
# ============================================================

def ask_gemini(image_path):

    print("\n>>> ask_gemini() STARTED <<<", flush=True)
    print(f">>> Image path: {image_path}", flush=True)

    try:
        image = Image.open(image_path)

        print(">>> Image opened successfully <<<", flush=True)

    except Exception as e:
        print(">>> IMAGE OPEN FAILED <<<", flush=True)
        print("ERROR:", repr(e), flush=True)
        raise


    prompt = """
Analyze this plant leaf image and identify the plant disease.

Return exactly this format:

Plant Name:
Disease Name:
Treatment:
Precautions:
Medicine:

Use the image to determine the disease.

If the leaf looks healthy, say:
Disease Name: Healthy

If you cannot determine the disease confidently, say:
Disease Name: Uncertain

Do not invent a disease.
"""


    print(">>> Starting Gemini API requests <<<", flush=True)
    print(f">>> Total keys available: {len(API_KEYS)} <<<", flush=True)


    # ========================================================
    # TRY EVERY KEY
    # ========================================================

    for index, key in enumerate(API_KEYS, start=1):

        print(f"\n>>> Trying Gemini KEY {index} <<<", flush=True)

        if not key:
            print(f">>> KEY {index} is empty - skipping <<<", flush=True)
            continue

        try:

            print(f">>> Creating Gemini client for KEY {index} <<<", flush=True)

            client = genai.Client(api_key=key)

            print(f">>> Sending image to Gemini with KEY {index} <<<", flush=True)

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=[
                    prompt,
                    image
                ]
            )

            print(f">>> KEY {index} SUCCESS <<<", flush=True)

            if response is None:
                print(">>> Gemini returned None <<<", flush=True)
                continue

            text = response.text

            print(">>> Gemini response received <<<", flush=True)
            print(text, flush=True)

            return text

        except Exception as e:

            print(f">>> KEY {index} FAILED <<<", flush=True)
            print("ERROR TYPE:", type(e).__name__, flush=True)
            print("ERROR:", repr(e), flush=True)

            continue


    print("\n>>> ALL GEMINI API REQUESTS FAILED <<<", flush=True)

    raise Exception("All Gemini API keys failed.")