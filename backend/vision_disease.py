import json
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from leaf_checker import is_leaf

# Load trained model
model = load_model("plantvillage_model.h5")

# Load class labels
with open("class_indices.json", "r") as f:
    class_indices = json.load(f)
print("CLASS INDICES:")
print(class_indices)

classes = {v: k for k, v in class_indices.items()}
classes = {}

for k, v in class_indices.items():
    classes[int(v)] = k

print("✅ Model Loaded")
print("Total Classes:", len(classes))

import cv2

def detect_plant_disease(image_path):

    leaf_result = is_leaf(image_path)

    if not leaf_result.get("is_leaf", False):

        return {
            "plant_name": "Unknown",
            "disease": "Please upload a plant leaf image",
            "confidence": 0,
            "symptoms": "-",
            "treatment": "-",
            "prevention": "-"
        }

    img = Image.open(image_path).convert("RGB")

    img = img.resize((128,128))

    img_array = np.array(img) / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    pred = model.predict(img_array, verbose=0)

    idx = np.argmax(pred)

    confidence = float(np.max(pred) * 100)

    disease_name = classes.get(
    idx,
    f"Unknown_Class_{idx}"
)
    plant_name = disease_name.split("___")[0]

    return {
        "plant_name": plant_name,
        "disease": disease_name,
        "confidence": round(confidence,2),
        "symptoms": "Detected using PlantVillage AI Model",
        "treatment": "Recommended treatment depends on disease",
        "prevention": "Regular monitoring and crop hygiene"
    }