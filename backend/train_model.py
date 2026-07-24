import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# Read dataset
df = pd.read_csv("Crop_recommendation.csv")

# Replace crop names
df["label"] = df["label"].replace({
    "maize": "wheat",
    "chickpea": "groundnut",
    "kidneybeans": "soybean",
    "pigeonpeas": "redgram",
    "mothbeans": "greengram",
    "mungbean": "blackgram",
    "blackgram": "horsegram",
    "lentil": "peas",
    "pomegranate": "guava",
    "apple": "tomato",
    "orange": "chilli",
    "papaya": "onion",
    "cotton": "sugarcane",
    "jute": "sunflower",
    "coffee": "ragi"
})

# Check replaced crops
print(df["label"].unique())
print("Total Crops:", len(df["label"].unique()))

# Features
X = df[["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]]
y = df["label"]

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

# Save model
pickle.dump(model, open("crop_model.pkl", "wb"))

print("Model trained successfully!")

# Test
sample = [[90, 42, 43, 20.8, 82.0, 6.5, 202.9]]
prediction = model.predict(sample)

print("Predicted Crop:", prediction[0])