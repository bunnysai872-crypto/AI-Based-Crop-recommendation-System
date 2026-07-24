import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import json
import os

# ===========================
# CHANGE THIS PATH
# ===========================
DATASET_PATH = r"C:\Users\bunny\OneDrive\Desktop\plantvillage dataset\color"

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10

# ===========================
# Image Generator
# ===========================
datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=20,
    zoom_range=0.2,
    shear_range=0.2,
    horizontal_flip=True,
    fill_mode="nearest"
)

train_generator = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    subset="training",
    class_mode="categorical"
)

validation_generator = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    subset="validation",
    class_mode="categorical"
)

NUM_CLASSES = len(train_generator.class_indices)

print("Number of classes:", NUM_CLASSES)
print(train_generator.class_indices)

# ===========================
# MobileNetV2 Model
# ===========================

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze pretrained layers
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.4)(x)
x = Dense(256, activation="relu")(x)

predictions = Dense(
    NUM_CLASSES,
    activation="softmax"
)(x)

model = Model(
    inputs=base_model.input,
    outputs=predictions
)

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ===========================
# Save Best Model
# ===========================

checkpoint = ModelCheckpoint(
    "plant_disease_model.keras",
    monitor="val_accuracy",
    save_best_only=True,
    verbose=1
)

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=3,
    restore_best_weights=True
)

# Save class names
class_names = train_generator.class_indices

with open("class_names.json", "w") as f:
    json.dump(class_names, f)

print("Class names saved.")

# ===========================
# Train Model
# ===========================

history = model.fit(
    train_generator,
    validation_data=validation_generator,
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stop]
)

print("Training Completed Successfully!")
print("Model Saved as plant_disease_model.keras")