from gemini_service import ask_gemini
import json



def verify_disease(image, prediction):


    prompt=f"""

You are an agriculture disease expert.

Analyze this plant leaf image.

My AI model prediction:

{prediction}


Verify this prediction.

Return ONLY JSON:

{{
"plant":"",
"status":"Healthy or Diseased",
"disease":"",
"confidence":"",
"symptoms":[],
"treatment":[]
}}

"""


    result = ask_gemini(
        image,
        prompt
    )


    try:
        return json.loads(result)

    except:

        return {
            "status":"Unknown",
            "message":result
        }