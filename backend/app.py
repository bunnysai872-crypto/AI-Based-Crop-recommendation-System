
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import jsonify, request
from gemini_service import ask_gemini
import requests
import pickle
import joblib
import pandas as pd
import mysql.connector
from geopy.geocoders import Nominatim
from deep_translator import GoogleTranslator
import os
from PIL import Image
import yfinance as yf
import random
import uuid
from vision_disease import detect_plant_disease
from leaf_checker import is_leaf
from PIL import Image
from model_service import predict_disease
from disease_verifier import verify_disease
from chatbot import farm_chat
import json

import numpy as np
from gemini_service import ask_gemini
from PIL import Image
import numpy as np




def translate_text(text, language):
    try:
        if language == "en":
            return text

        return GoogleTranslator(
            source="auto",
            target=language
        ).translate(str(text))

    except Exception as e:
        print("Translation Error:", e)
        return text
app = Flask(__name__)
CORS(app)
# Load Disease Model



# Load YOLO Model (optional)





# Load Treatment Database

with open("treatments.json") as file:
    treatment_data = json.load(file)




# -------------------------------
# Gemini Configuration
# -------------------------------

#GEMINI_API_KEY = "AQ.Ab8RN6IE-pTHBq2mexKCZqzrYFg07_yjisbsD6SF2ClGAtraAg"

#genai.configure(api_key=GEMINI_API_KEY)

#gemini_model = genai.GenerativeModel(
#    model_name="gemini-2.0-flash"
#)

# Stores conversation history
chat_sessions = {}
SYSTEM_PROMPT = """
You are AgriAI, an expert AI assistant for farmers.

Your goal is to answer ALL agriculture-related questions accurately, clearly, and helpfully.

Your knowledge includes:

1. Crop cultivation
2. Crop recommendation
3. Soil types and soil health
4. Fertilizers and nutrient management
5. Organic farming
6. Irrigation methods
7. Water management
8. Weed management
9. Pest management
10. Plant disease management
11. Seed selection
12. Seed treatment
13. Harvesting
14. Post-harvest storage
15. Market prices
16. Government schemes
17. Weather impact on crops
18. Horticulture
19. Floriculture
20. Fruit cultivation
21. Vegetable cultivation
22. Plantation crops
23. Medicinal plants
24. Dairy farming
25. Goat farming
26. Sheep farming
27. Poultry farming
28. Fish farming
29. Beekeeping
30. Mushroom cultivation
31. Farm machinery
32. Precision farming
33. Smart farming
34. Greenhouse farming
35. Hydroponics
36. Aquaponics
37. Sustainable agriculture
38. Climate-smart agriculture
39. Agricultural economics
40. Farm business planning

If the user asks for:

• Crop recommendation → reply ONLY:
TOOL:CROP

• Disease detection from a leaf image → reply ONLY:
TOOL:DISEASE

• Weather information → reply ONLY:
TOOL:WEATHER

• Market prices → reply ONLY:
TOOL:MARKET

For every other agriculture-related question:
- Answer directly.
- Give practical advice.
- Explain step by step when needed.
- Suggest preventive measures if relevant.
- Mention safety precautions for pesticide use.
- If the user does not provide enough information (crop, location, soil type, etc.), ask follow-up questions before giving advice.

Never answer with unrelated topics unless the user explicitly asks.

Always behave like an experienced agricultural expert who helps farmers solve real farming problems.
"""
def get_chat(session_id):

    if session_id not in chat_sessions:

        chat_sessions[session_id] = gemini_model.start_chat(
            history=[
                {
                    "role":"user",
                    "parts":[SYSTEM_PROMPT]
                },
                {
                    "role":"model",
                    "parts":["Hello Farmer 👋 How can I help you today?"]
                }
            ]
        )

    return chat_sessions[session_id]# Enable CORS

# Connect MySQL
try:
    db = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="root",
        database="crop_ai",
        auth_plugin="mysql_native_password"
    )
    cursor = db.cursor()
    print("MySQL Connected Successfully")
except Exception as e:
    print("MySQL Error:", e)

# Load the validated XGBoost pipeline first.  The legacy model remains a
# fallback until the new training job has produced its artifact.
crop_pipeline = None
crop_label_encoder = None
model_metrics = {"algorithm": "Legacy model", "validation_accuracy": None}
try:
    crop_artifact = joblib.load("crop_recommendation_model.pkl")
    if isinstance(crop_artifact, dict):
        crop_pipeline = crop_artifact["pipeline"]
        crop_label_encoder = crop_artifact["label_encoder"]
        with open("crop_model_metrics.json", encoding="utf-8") as metrics_file:
            model_metrics = json.load(metrics_file)
        print("Validated XGBoost crop pipeline loaded")
except Exception as error:
    print("XGBoost model not available yet:", error)

# Legacy model fallback
try:
    model = pickle.load(open("crop_model.pkl", "rb"))
    soil_encoder = pickle.load(
        open("soil_encoder.pkl", "rb")
    )

    print("Model Loaded Successfully")
    print("Soil Encoder Loaded")

except Exception as e:
    print("Model Error:", e)

# Home route
@app.route("/")
def home():
    return "AI Crop Recommendation API Running"

# Prediction route
# ---------------- MARKET DATA ----------------

crop_market_data = {
    "rice": {"price": 2800, "yield": 25, "cost": 25000},
    "wheat": {"price": 2600, "yield": 20, "cost": 18000},
    "ragi": {"price": 4200, "yield": 10, "cost": 12000},
    "banana": {"price": 1200, "yield": 150, "cost": 50000},
    "maize": {"price": 2200, "yield": 30, "cost": 15000},
    "cotton": {"price": 7000, "yield": 8, "cost": 30000},
    "mango": {"price": 3500, "yield": 50, "cost": 40000},
    "jute": {"price": 5000, "yield": 12, "cost": 25000},
    "coffee": {"price": 8000, "yield": 6, "cost": 30000},
    "coconut": {"price": 2500, "yield": 80, "cost": 35000}
}


def get_market_demand(price):
    if price >= 5000:
        return "Very High"
    elif price >= 3000:
        return "High"
    elif price >= 2000:
        return "Medium"
    else:
        return "Low"


# ---------------- PREDICT API ----------------

@app.route("/predict", methods=["POST"])
def predict():

    print("Predict API Called")

    try:

        data = request.get_json()
        soiltype = data["soiltype"]

# Fix spelling mismatch
        if soiltype == "Alluvial Soil":
         soiltype = "Allvial Soil"

        soil_encoded = None
        if crop_pipeline is None:
            soil_encoded = soil_encoder.transform([soiltype])[0]

        print("Received Data:", data)

        # Input values
        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        ph = float(data["ph"])

        # Validation
        if N <= 0 or N > 140:
            return jsonify({"error": "Invalid N value"}), 400

        if P <= 0 or P > 145:
            return jsonify({"error": "Invalid P value"}), 400

        if K <= 0 or K > 205:
            return jsonify({"error": "Invalid K value"}), 400

        if ph < 3.5 or ph > 10:
            return jsonify({"error": "Invalid pH value"}), 400

        temperature = float(data.get("temperature"))
        humidity = float(data.get("humidity"))
        rainfall = float(data.get("rainfall"))

        print("----------- INPUTS -----------")
        print("N:", N)
        print("P:", P)
        print("K:", K)
        print("Temperature:", temperature)
        print("Humidity:", humidity)
        print("pH:", ph)
        print("Rainfall:", rainfall)
        print("------------------------------")

        # Prediction probabilities.  The XGBoost pipeline accepts named fields,
        # while older saved models still use the encoded numeric array.
        if crop_pipeline is not None:
            features = pd.DataFrame([{
                "Soiltype": soiltype, "N": N, "P": P, "K": K,
                "temperature": temperature, "humidity": humidity,
                "ph": ph, "rainfall": rainfall,
            }])
            probs = crop_pipeline.predict_proba(features)[0]
            classes = crop_label_encoder.inverse_transform(
                np.arange(len(probs))
            )
        else:
            probs = model.predict_proba([[
                soil_encoded, N, P, K, temperature, humidity, ph, rainfall
            ]])[0]
            classes = model.classes_

        # Top 3 predictions
        top3 = sorted(
            zip(classes, probs),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        print("TOP 3:", top3)

        # Best crop
        crop = str(top3[0][0]).lower()

        # Market Data
        if crop in crop_market_data:

            market_price = crop_market_data[crop]["price"]
            yield_per_acre = crop_market_data[crop]["yield"]
            cultivation_cost = crop_market_data[crop]["cost"]

            revenue = market_price * yield_per_acre
            profit = revenue - cultivation_cost

            market_demand = get_market_demand(market_price)

        else:

            market_price = 2000
            profit = 15000
            market_demand = "Medium"

        # Save prediction
        try:

            cursor.execute(
                """
                INSERT INTO predictions
                (farmer_name, ph, temperature, crop)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    "Farmer",
                    ph,
                    temperature,
                    crop
                )
            )

            db.commit()

        except Exception as db_error:
            print("Database Error:", db_error)

        # Top 3 JSON
        top3_result = []

        for item in top3:

            top3_result.append(
                {
                    "crop": str(item[0]),
                    "confidence": round(float(item[1]) * 100, 2)
                }
            )

        # Final response
               # Final response
        response = {
            "success": True,
            "recommended_crop": crop.title(),

            "confidence": round(
                float(top3[0][1]) * 100,
                2
            ),

            "model_accuracy": model_metrics.get("validation_accuracy"),
            "model_algorithm": model_metrics.get("algorithm", "Legacy model"),

            "top3": top3_result,

            "market_price": market_price,

            "market_demand": market_demand,

            "profit": round(profit, 2)
        }

        print("FINAL RESPONSE:", response)

        return jsonify(response)
    except Exception as e:

        print("Prediction Error:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
from geopy.geocoders import Nominatim
from flask import request, jsonify

@app.route('/current-location', methods=['POST'])
def current_location():
    print("🔥 /current-location API HIT")
    try:
        data = request.get_json()
        print(data)

        latitude = float(data["latitude"])
        longitude = float(data["longitude"])

        API_KEY = "7abcbdcba55e4de680f1281e273bf101"

        url = "https://api.geoapify.com/v1/geocode/reverse"

        params = {
            "lat": latitude,
            "lon": longitude,
            "apiKey": API_KEY
        }

        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        result = response.json()
        print("Latitude:", latitude)
        print("Longitude:", longitude)
        print(result)

        if len(result["features"]) == 0:
            return jsonify({
                "success": False,
                "error": "Location not found"
            })

        props = result["features"][0]["properties"]

        return jsonify({
            "success": True,
            "village": props.get("village", ""),
            "city": props.get("city", ""),
            "mandal": props.get("county", ""),
            "district": props.get("state_district", ""),
            "state": props.get("state", ""),
            "postcode": props.get("postcode", ""),
            "road": props.get("street", ""),
            "latitude": latitude,
            "longitude": longitude
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
@app.route("/register-machine", methods=["POST"])
def register_machine():
    try:
        data = request.get_json()

        owner_name = data.get("owner_name")
        phone = data.get("phone")
        district = data.get("district")
        village = data.get("village")
        machine_name = data.get("machine_name")
        crops = data.get("crops")
        rent_per_acre = data.get("rent_per_acre")
        pin = data.get("pin")
        availability = data.get("availability")
        print("Received Data:", data)

        print(owner_name)
        print(phone)
        print(district)
        print(village)
        print(machine_name)
        print(crops)
        print(rent_per_acre)
        print(availability)
        cursor.execute("""
           INSERT INTO farm_machines
(owner_name, phone, district, village,
 machine_name, crops, rent_per_acre, availability, pin)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            owner_name,
            phone,
            district,
            village,
            machine_name,
            crops,
            rent_per_acre,
            availability,
            pin
        ))

        db.commit()

        return jsonify({
            "success": True,
            "message": "Machine Registered Successfully"
        })

    except Exception as e:
        print("Register Machine Error:", e)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
 
@app.route("/machines", methods=["GET"])
def get_machines():
    try:

        # ADD THIS LINE HERE 👇
        language = request.args.get("language", "en")

        cursor.execute("""
            SELECT id, owner_name, phone, district, village,
                   machine_name, crops, rent_per_acre, availability
            FROM farm_machines
        """)
        rows = cursor.fetchall()

        machines = []

        for row in rows:
         machines.append({
    "id": row[0],
    "owner_name": row[1],
    "phone": row[2],
    "district": translate_text(row[3], language),
    "village": translate_text(row[4], language),
    "machine_name": translate_text(row[5], language),
    "crops": translate_text(row[6], language),
    "rent_per_acre": row[7],
    "availability": translate_text(row[8], language)
})

        return jsonify(machines)

    except Exception as e:
        print("Machines Error:", e)
        return jsonify({"error": str(e)}), 500
    
@app.route("/update-machine-status/<int:id>", methods=["PUT"])
def update_machine_status(id):
    try:
        data = request.get_json()

        availability = data.get("availability")

        cursor.execute("""
            UPDATE farm_machines
            SET availability = %s
            WHERE id = %s
        """, (availability, id))

        db.commit()

        return jsonify({
            "success": True,
            "message": "Machine status updated successfully"
        })

    except Exception as e:
        print("Update Status Error:", e)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
        
DISEASE_CALENDAR = {
    "rice": {"diseases": ["Blast", "Bacterial leaf blight", "Sheath blight"], "areas": ["West Bengal", "Odisha", "Andhra Pradesh", "Telangana"], "period": "July–October (humid Kharif period)"},
    "wheat": {"diseases": ["Yellow rust", "Leaf rust", "Powdery mildew"], "areas": ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh"], "period": "December–March (cool, moist spells)"},
    "cotton": {"diseases": ["Alternaria leaf spot", "Bacterial blight", "Fusarium wilt"], "areas": ["Maharashtra", "Gujarat", "Telangana", "Punjab"], "period": "July–September (monsoon canopy growth)"},
    "tomato": {"diseases": ["Early blight", "Late blight", "Leaf curl"], "areas": ["Karnataka", "Maharashtra", "Andhra Pradesh", "Tamil Nadu"], "period": "June–September and November–January"},
    "potato": {"diseases": ["Late blight", "Early blight", "Black scurf"], "areas": ["Uttar Pradesh", "West Bengal", "Bihar", "Punjab"], "period": "December–February (cool, wet weather)"},
}

CARE_GUIDE = {
    "rice": {"fertilizer": "NPK 20:20:20", "rate": 100, "match": 92, "pesticide": "Tricyclazole only for confirmed blast, as locally registered"},
    "wheat": {"fertilizer": "NPK 12:32:16", "rate": 90, "match": 91, "pesticide": "Propiconazole only for confirmed rust, as locally registered"},
    "cotton": {"fertilizer": "NPK 19:19:19", "rate": 75, "match": 93, "pesticide": "Use pest-threshold-based, locally registered control after scouting"},
    "tomato": {"fertilizer": "Water-soluble NPK 19:19:19", "rate": 80, "match": 90, "pesticide": "Mancozeb for confirmed fungal leaf spot, per label and local advice"},
}

def normalize_crop(value):
    return " ".join(str(value or "").lower().replace("plant", "").split())

def disease_insights(crop):
    return DISEASE_CALENDAR.get(normalize_crop(crop), {
        "diseases": ["Leaf spot", "Powdery mildew", "Wilt"],
        "areas": ["Local growing areas"],
        "period": "Monitor during humid or rainy periods",
    })

@app.route("/crop-care", methods=["POST"])
def crop_care():
    data = request.get_json() or {}
    crop = normalize_crop(data.get("crop"))
    acres = max(float(data.get("acres", 1) or 1), 0.1)
    guide = CARE_GUIDE.get(crop, {
        "fertilizer": "Balanced NPK based on a soil test", "rate": 60,
        "match": 80, "pesticide": "Use only after pest/disease confirmation and local-label guidance",
    })
    return jsonify({
        "success": True, "crop": crop.title(),
        "fertilizer": {
            "product": guide["fertilizer"], "quantity_kg": round(guide["rate"] * acres, 1),
            "rate_kg_per_acre": guide["rate"], "nutrient_match_percent": guide["match"],
            "basis": "Starter guidance; confirm with a recent soil test."
        },
        "pesticide": {"recommendation": guide["pesticide"], "safety": "Follow the product label, PPE, pre-harvest interval, and local agricultural officer guidance."},
    })

@app.route("/disease-insights", methods=["GET"])
def get_disease_insights():
    crop = request.args.get("crop", "")
    return jsonify({"success": True, "crop": crop.title(), **disease_insights(crop)})

def parse_disease_analysis(text):
    fields = {}
    for line in str(text).splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            fields[key.strip().lower()] = value.strip()
    return fields

def crop_hint_from_filename(filename):
    """Only used as a clearly marked UI fallback if the local model crashes."""
    value = str(filename or "").lower()
    aliases = {
        "grape": "Grape", "tomato": "Tomato", "potato": "Potato",
        "apple": "Apple", "corn": "Maize", "maize": "Maize",
        "orange": "Orange", "pepper": "Pepper", "cherry": "Cherry",
    }
    return next((crop for token, crop in aliases.items() if token in value), "Unknown crop")

@app.route("/detect-disease", methods=["POST"])
def detect_disease():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image uploaded"
        })

    image = request.files["image"]
    uploaded_filename = image.filename

    os.makedirs("uploads", exist_ok=True)

    image_path = os.path.join("uploads", "temp.jpg")

    image.save(image_path)

    print("================================")
    print("DETECT DISEASE ROUTE CALLED")
    print("Image saved:", image_path)
    print("Calling local PlantVillage disease model...")
    print("================================")

    try:
        # First gate: do not send a random/non-plant image to the disease
        # classifier.  The image must pass the offline leaf validation.
        leaf_check = is_leaf(image_path)
        if not leaf_check.get("is_leaf", False):
            return jsonify({
                "success": False,
                "status": "not_a_leaf",
                "message": "This image does not appear to contain a crop leaf. Please upload a clear plant-leaf photo.",
                "reason": leaf_check.get("reason", "Plant leaf not detected")
            }), 400

        # This route intentionally uses the bundled vision model only. It
        # avoids a Gemini key/quota failure and always produces the same JSON
        # structure for the frontend.
        prediction = detect_plant_disease(image_path)
        raw_crop = str(prediction.get("plant_name", "Unknown"))
        raw_disease = str(prediction.get("disease", "Uncertain"))

        if raw_disease.lower().startswith("please upload"):
            return jsonify({
                "success": False,
                "message": "Please upload a clear photo of one crop leaf.",
                "status": "not_a_leaf"
            }), 400

        crop = raw_crop.replace("_", " ").strip()
        disease = raw_disease.replace("___", " – ").replace("_", " ").strip()
        insights = disease_insights(crop)
        treatment = "Remove severely affected leaves, improve airflow, and confirm treatment locally before spraying."
        return jsonify({
            "success": True,
            "status": "detected",
            "crop": crop.title(),
            "disease": disease,
            "confidence": prediction.get("confidence"),
            "treatment": treatment,
            "precautions": ["Avoid overhead irrigation", "Sanitize tools after use", "Monitor nearby plants"],
            "insights": insights,
        })
    except Exception as error:
        print("LOCAL DISEASE MODEL ERROR:", repr(error))
        crop = crop_hint_from_filename(uploaded_filename)
        return jsonify({
            "success": True,
            "status": "review_needed",
            "crop": crop,
            "disease": "Needs visual review",
            "confidence": None,
            "treatment": "The image was received, but the local model needs review. Use the crop advisory below and consult a local agricultural officer before applying any product.",
            "precautions": ["Keep the leaf sample", "Avoid preventive spraying without diagnosis", "Upload a close, well-lit image if retrying"],
            "insights": disease_insights(crop),
            "model_error": "Local classifier unavailable for this image"
        })
@app.route("/my-machines", methods=["POST"])
def my_machines():
    try:
        data = request.get_json()

        phone = data.get("phone")
        pin = data.get("pin")

        cursor.execute("""
            SELECT id,
                   owner_name,
                   phone,
                   district,
                   village,
                   machine_name,
                   crops,
                   rent_per_acre,
                   availability
            FROM farm_machines
            WHERE phone=%s AND pin=%s
        """, (phone, pin))

        rows = cursor.fetchall()

        machines = []

        for row in rows:
            machines.append({
                "id": row[0],
                "owner_name": row[1],
                "phone": row[2],
                "district": row[3],
                "village": row[4],
                "machine_name": row[5],
                "crops": row[6],
                "rent_per_acre": row[7],
                "availability": row[8]
            })

        return jsonify(machines)

    except Exception as e:
        return jsonify({"error": str(e)}), 500



import requests

# data.gov.in publishes the Ministry of Agriculture / AGMARKNET mandi feed.
# Configure DATA_GOV_API_KEY in the server environment for production.
API_KEY = os.getenv("DATA_GOV_API_KEY", "579b464db66ec23bdd00000164cf42d3199a404160c7582e0446cc2c")

def fallback_market_prices(crop, state):
    """Reliable chart data when the public market feed is empty or offline."""
    name = (crop or "Rice").title()
    base = {"Rice": 2450, "Wheat": 2550, "Maize": 2200, "Cotton": 6900,
            "Tomato": 1800, "Potato": 1600, "Onion": 2100, "Banana": 1700,
            "Mango": 4200}.get(name, 2400)
    demand = ["Low", "Medium", "High", "Very High"]
    factors = [0.92, 0.98, 1.05, 1.10]
    return [{
        "crop": name, "market": "Indicative local market", "district": "Selected area",
        "state": state.title() or "India", "min_price": round(base * factor * .92),
        "max_price": round(base * factor * 1.08), "modal_price": round(base * factor),
        "arrival_date": f"Week {index + 1}", "period": f"Week {index + 1}",
        "demand": demand[index], "source": "indicative fallback"
    } for index, factor in enumerate(factors)]

@app.route("/market-prices", methods=["GET"])
def market_prices():

    state = request.args.get("state", "").strip().lower()
    crop = request.args.get("crop", "").strip().lower()

    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": 5000
    }
    if state:
        params["filters[state]"] = state.title()
    if crop:
        params["filters[commodity]"] = crop.title()

    try:
        response = requests.get(
            url,
            params=params,
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            },
            timeout=15
        )

        data = response.json()

        print("Total API Records:", len(data.get("records", [])))

        prices = []

        for item in data.get("records", []):

            api_state = item.get("state", "").strip().lower()
            api_crop = item.get("commodity", "").strip().lower()

            # Filter state
            if state != "" and state != api_state:
                continue

            # Filter crop
            if crop != "" and crop not in api_crop:
                continue

            prices.append({
                "crop": item.get("commodity"),
                "market": item.get("market"),
                "district": item.get("district"),
                "state": item.get("state"),
                "min_price": item.get("min_price"),
                "max_price": item.get("max_price"),
                "modal_price": item.get("modal_price"),
                "arrival_date": item.get("arrival_date"),
                "period": item.get("arrival_date") or "Current mandi report",
                "demand": "Government mandi feed",
                "source": "AGMARKNET / data.gov.in"
            })

        print("Matched Records:", len(prices))

        if not prices:
            prices = fallback_market_prices(crop, state)

        return jsonify({
            "success": True,
            "prices": prices
        })

    except Exception as e:
        print(e)
        return jsonify({
            "success": True,
            "prices": fallback_market_prices(crop, state),
            "message": "Live market feed unavailable; showing indicative weekly prices."
        })
        
        from deep_translator import GoogleTranslator

@app.route("/translate", methods=["POST"])
def translate():
    data = request.json

    text = data.get("text")
    target = data.get("target")

    try:
        translated = GoogleTranslator(source="auto", target=target).translate(text)
        return jsonify({
            "success": True,
            "translated": translated
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })
        
def crop_recommendation_tool():
    return {
        "tool": "crop_recommendation",
        "message": "Sure! I can recommend the best crop. Please provide your location and soil type."
    }


def disease_detection_tool():
    return {
        "tool": "disease_detection",
        "message": "Please upload a clear image of the affected leaf for disease analysis."
    }


def weather_tool():
    return {
        "tool": "weather",
        "message": "Please share your location so I can check the latest weather forecast."
    }


def market_price_tool():
    return {
        "tool": "market_price",
        "message": "Please tell me the crop name to check today's market price."
    }
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        message = data.get("message", "").strip()
        session_id = data.get("session_id", "default")

        print("User:", message)

        chat = get_chat(session_id)

        response = chat.send_message(message)

        print("Gemini:", response.text)

        reply = response.text.strip()

        return jsonify({
            "success": True,
            "type": "chat",
            "reply": reply
        })

    except Exception as e:
        print("Chat Error:", e)
        return jsonify({
            "success": False,
            "type": "chat",
            "reply": str(e)
        }), 500 
         
@app.route("/test")
def test():
    try:
        response = gemini_model.generate_content("Hello")
        return response.text
    except Exception as e:
        return str(e)
    
@app.route("/farmgpt", methods=["POST"])
def farmgpt():
    try:
        data = request.get_json()

        print("Received:", data)

        message = data.get("message", "")

        answer = farm_chat(message)

        return jsonify({
            "reply": answer
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({
            "reply": f"Server Error: {str(e)}"
        }), 500

from flask import jsonify

@app.route("/notifications")
def notifications():

    notifications = [
        "🌧 Heavy rain expected tomorrow in Bangalore",
        "📈 Rice market price increased by ₹120",
        "🏛 PM-KISAN installment released"
    ]

    return jsonify(notifications)
@app.route("/delete-machine/<int:id>", methods=["DELETE"])
def delete_machine(id):
    try:
        print("Deleting machine ID:", id)

        cursor.execute("""
            DELETE FROM farm_machines
            WHERE id=%s
        """, (id,))

        db.commit()

        return jsonify({
            "success": True,
            "message": "Machine deleted successfully"
        })

    except Exception as e:
        print("Delete Machine Error:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
if __name__ == "__main__":
    print("Starting Flask Server...")
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
