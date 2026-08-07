import pandas as pd
import pickle

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("Crop_recommendation 2(in).csv")

# Encode Soil Type
soil_encoder = LabelEncoder()
df["Soiltype"] = soil_encoder.fit_transform(df["Soiltype"])

# Features
X = df[
    [
        "Soiltype",
        "N",
        "P",
        "K",
        "temperature",
        "humidity",
        "ph",
        "rainfall"
    ]
]

# Target
y = df["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Accuracy
pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)

print(f"Accuracy: {acc*100:.2f}%")

# Save
pickle.dump(model, open("crop_model.pkl", "wb"))
pickle.dump(soil_encoder, open("soil_encoder.pkl", "wb"))

print("Model Saved Successfully")