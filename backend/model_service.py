from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import json


# Load trained model
model = load_model("plantvillage_model.h5")


# Load class names
with open("labels.json","r") as f:
    labels = json.load(f)



def predict_disease(image):

    image = image.resize((128,128))

    img_array = np.array(image)

    if len(img_array.shape) == 3 and img_array.shape[-1] == 4:
        img_array = img_array[:, :, :3]

    img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array, verbose=0)

    index = int(np.argmax(prediction))

    confidence = float(np.max(prediction))

    print("Predicted Index:", index)
    print("Labels Type:", type(labels))

    try:
        disease = labels[str(index)]
    except:
       print("Predicted Index:", index)
       print("Labels Keys:", list(labels.keys())[:10])

    disease = labels.get(str(index))

    if disease is None:
     disease = labels.get(index)

    print("Disease:", disease)

    return {
        "disease": disease,
        "confidence": round(confidence * 100, 2)
    }