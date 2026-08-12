import joblib
import pandas as pd


# Load model
model = joblib.load("crop_recommendation_model.pkl")

print("Model loaded successfully!")
print("Model type:", type(model))


# Test input
sample = pd.DataFrame([
    {
        "Soiltype": "Loamy",
        "N": 90,
        "P": 42,
        "K": 43,
        "temperature": 25.5,
        "humidity": 80,
        "ph": 6.5,
        "rainfall": 200
    }
])


print("\nInput:")
print(sample)


# Prediction
prediction = model.predict(sample)[0]


# Confidence
probabilities = model.predict_proba(sample)[0]

confidence = max(probabilities) * 100


print("\n==============================")
print("PREDICTION RESULT")
print("==============================")

print("Recommended Crop:", prediction)
print("AI Confidence:", round(confidence, 2), "%")