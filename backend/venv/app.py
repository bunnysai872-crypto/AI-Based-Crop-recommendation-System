from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator

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

@app.route('/')
def home():
    return "AI Crop Recommendation API Running"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    ph = float(data['ph'])
    temperature = float(data['temperature'])

    if ph < 6.5:
        crop = "Rice"
    elif temperature > 30:
        crop = "Maize"
    else:
        crop = "Wheat"

    return jsonify({
        "recommended_crop": crop
    })
    
if __name__ == "__main__":
    app.run(debug=True)