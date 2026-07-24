
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
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import json
import yfinance as yf
import random


# Load the disease prediction model
try:
    disease_model = load_model("plant_disease_model.keras")
    with open("class_names.json", "r") as f:
        class_names = json.load(f)
    print("Disease Model Loaded Successfully")
except Exception as e:
    print("Disease Model Error:", e)
    
    from tensorflow.keras.models import load_model
import json

try:
    disease_model = load_model("plant_disease_model.keras")

    with open("class_names.json", "r") as f:
        class_indices = json.load(f)

    class_names = list(class_indices.keys())

    print("Disease Model Loaded Successfully")

except Exception as e:
    print("Disease Model Error:", e)

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
CORS(app)   # Enable CORS

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
    print("Model Loaded Successfully")
except Exception as e:
    print("Model Error:", e)

# Home route
@app.route("/")
def home():
    return "AI Crop Recommendation API Running"

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    print("Predict API Called")
    try:
        data = request.get_json()

        print("Received Data:", data)

        N = float(data.get("N"))
        P = float(data.get("P"))
        K = float(data.get("K"))
        temperature = float(data.get("temperature"))
        humidity = float(data.get("humidity"))
        ph = float(data.get("ph"))
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
        # Get probabilities
        probs = model.predict_proba(
            [[N, P, K, temperature, humidity, ph, rainfall]]
        )[0]

        classes = model.classes_

        top3 = sorted(
            zip(classes, probs),
            key=lambda x: x[1],
            reverse=True
        )[:3]

        crop = top3[0][0]

        # Save prediction
        try:
            cursor.execute(
                """
                INSERT INTO predictions
                (farmer_name, ph, temperature, crop)
                VALUES (%s, %s, %s, %s)
                """,
                ("Farmer", ph, temperature, crop)
            )
            db.commit()
        except Exception as db_error:
            print("Database Error:", db_error)

        return jsonify({
            "success": True,
            "recommended_crop": crop,
            "confidence": round(float(top3[0][1]) * 100, 2),
            "top3": [
                {
                    "crop": c,
                    "confidence": round(float(p) * 100, 2)
                }
                for c, p in top3
            ]
        })

    except Exception as e:
        print("Prediction Error:", e)
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
@app.route('/current-location', methods=['POST'])
def current_location():
    try:
        data = request.get_json()

        latitude = data["latitude"]
        longitude = data["longitude"]

        geolocator = Nominatim(
            user_agent="agri_ai"
        )

        language = data.get("language", "en")

        location = geolocator.reverse(
            f"{latitude}, {longitude}",
            language=language
        )

        address = location.raw["address"]

        city = (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("suburb")
            or address.get("county")
            or address.get("state")
        )

        translations = {
            "Ittagalpura": {
                "te": "ఇట్టగల్పుర",
                "hi": "इट्टागलपुरा",
                "ta": "இட்டகல்புரா"
            },
            "Bangalore": {
                "te": "బెంగళూరు",
                "hi": "बेंगलुरु",
                "ta": "பெங்களூரு"
            },
            "Hyderabad": {
                "te": "హైదరాబాద్",
                "hi": "हैदराबाद",
                "ta": "ஹைதராபாத்"
            }
        }

        if city in translations and language != "en":
            city = translations[city].get(
                language,
                city
            )

        return jsonify({
            "city": city
        })

    except Exception as e:
        print(e)
        return jsonify({
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
        
@app.route("/delete-machine/<int:id>", methods=["DELETE"])
def delete_machine(id):
    try:
        data = request.get_json()

        pin = data.get("pin")

        cursor.execute(
            "DELETE FROM farm_machines WHERE id=%s AND pin=%s",
            (id, pin)
        )

        db.commit()

        if cursor.rowcount == 0:
            return jsonify({
                "success": False,
                "message": "Invalid PIN"
            }), 403

        return jsonify({
            "success": True,
            "message": "Machine deleted successfully"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
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
    
@app.route("/detect-disease", methods=["POST"])
def detect_disease():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Please upload a leaf image."
        }), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "Please upload a leaf image."
        }), 400

    try:

        # Load image
        img = Image.open(file.stream).convert("RGB")
        img = img.resize((224, 224))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        prediction = disease_model.predict(img_array)

        class_index = np.argmax(prediction)

        confidence = float(np.max(prediction)) * 100

        predicted_class = class_names[class_index]

        # Example:
        # Tomato___Late_blight

        parts = predicted_class.split("___")

        crop = parts[0].replace("_", " ")

        disease = parts[1].replace("_", " ")

        # Temporary medicine

        medicine = "Consult Agricultural Officer"

        dosage = "As recommended"

        prevention = "Maintain healthy crop management."

        return jsonify({

            "success": True,

            "crop": crop,

            "disease": disease,

            "confidence": round(confidence,2),

            "medicine": medicine,

            "dosage": dosage,

            "prevention": prevention

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e)

        }),500
        
from flask import jsonify, request
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
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )