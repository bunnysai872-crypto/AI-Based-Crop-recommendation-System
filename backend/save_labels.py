from tensorflow.keras.preprocessing.image import ImageDataGenerator
import json

DATASET_PATH = r"C:\Users\bunny\OneDrive\Desktop\plantvillage dataset\color"

gen = ImageDataGenerator()

data = gen.flow_from_directory(
    DATASET_PATH,
    target_size=(224, 224),
    batch_size=32
)

with open("labels.json", "w") as f:
    json.dump(data.class_indices, f)

print("✅ labels.json created successfully")
print(data.class_indices)