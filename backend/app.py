
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import jsonify, request
import requests
import pickle
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

# Load model
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

        soil_encoded = soil_encoder.transform(
    [soiltype]
)[0]

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

        # Prediction probabilities
        probs = model.predict_proba([[
    soil_encoded,
    N,
    P,
    K,
    temperature,
    humidity,
    ph,
    rainfall
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
        response = {

            "success": True,

            "recommended_crop": crop.title(),

            "confidence": round(
                float(top3[0][1]) * 100,
                2
            ),

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
        
@app.route("/detect-disease", methods=["POST"])
def detect_disease():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "No image uploaded"
        })

    image = request.files["image"]

    os.makedirs("uploads", exist_ok=True)

    image_path = "uploads/temp.jpg"

    image.save(image_path)

    try:

        analysis = ask_gemini(image_path)

        return jsonify({
            "success": True,
            "analysis": analysis
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
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

API_KEY = "579b464db66ec23bdd00000164cf42d3199a404160c7582e0446cc2c"

@app.route("/market-prices", methods=["GET"])
def market_prices():

    state = request.args.get("state", "").strip().lower()
    crop = request.args.get("crop", "").strip().lower()

    url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

    params = {
        "api-key": API_KEY,
        "format": "json",
        "limit": 1000
    }

    try:
        response = requests.get(
            url,
            params=params,
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            },
            timeout=120
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
                "arrival_date": item.get("arrival_date")
            })

        print("Matched Records:", len(prices))

        return jsonify({
            "success": True,
            "prices": prices
        })

    except Exception as e:
        print(e)
        return jsonify({
            "success": False,
            "message": str(e)
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