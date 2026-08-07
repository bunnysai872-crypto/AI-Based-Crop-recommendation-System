from gemini_service import ask_gemini
import json
import re


def is_leaf(image):

    prompt = """
You are a plant expert.

Analyze the image.

Return ONLY valid JSON.

{
    "is_leaf": true,
    "plant_name": "Plant Name",
    "reason": "Reason"
}

OR

{
    "is_leaf": false,
    "plant_name": "",
    "reason": "Not a plant leaf"
}
"""

    response = ask_gemini(image, prompt)

    print("Gemini Response:")
    print(response)

    try:

        # Remove markdown code blocks
        response = response.replace("```json", "")
        response = response.replace("```", "")
        response = response.strip()

        # Extract JSON object
        match = re.search(r"\{.*\}", response, re.DOTALL)

        if match:
            response = match.group()

        result = json.loads(response)

        return result

    except Exception as e:

        print("Leaf Checker Error:", str(e))

        # TEMPORARY FALLBACK
        return {
            "is_leaf": True,
            "plant_name": "Unknown",
            "reason": "Fallback mode"
        }