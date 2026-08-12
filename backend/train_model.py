"""Train and validate the crop recommendation model.

The accuracy gate intentionally prevents a model below 90% validation accuracy
from replacing the production model.
"""
import json
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier


# Load dataset
df = pd.read_csv("Crop_recommendation_10000_rows.csv")

print("Dataset loaded successfully!")
print("Rows:", len(df))


# Features
features = [
    "Soiltype",
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall"
]

X = df[features]
y = df["label"]


# Preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        (
            "soil",
            OneHotEncoder(handle_unknown="ignore"),
            ["Soiltype"]
        ),
        (
            "numeric",
            StandardScaler(),
            [
                "N",
                "P",
                "K",
                "temperature",
                "humidity",
                "ph",
                "rainfall"
            ]
        )
    ]
)


# XGBoost model.  Labels are encoded by the pipeline output with native
# multi-class support, while crop names are restored before persistence.
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.20, random_state=42, stratify=y_encoded
)

classifier = XGBClassifier(
    n_estimators=350,
    max_depth=7,
    learning_rate=0.08,
    subsample=0.9,
    colsample_bytree=0.9,
    objective="multi:softprob",
    eval_metric="mlogloss",
    random_state=42,
    n_jobs=-1,
)


# COMPLETE PIPELINE
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", classifier)
])


# Train
print("\nTraining model...")

pipeline.fit(X_train, y_train)

print("Training completed!")


# Test
y_pred = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", round(accuracy * 100, 2), "%")

if accuracy < 0.90:
    raise RuntimeError(
        f"Validation accuracy {accuracy * 100:.2f}% is below the required 90%. "
        "The production model was not replaced."
    )


# Save COMPLETE PIPELINE
joblib.dump(
    {"pipeline": pipeline, "label_encoder": label_encoder},
    "crop_recommendation_model.pkl"
)

with open("crop_model_metrics.json", "w", encoding="utf-8") as file:
    json.dump({
        "algorithm": "XGBoost",
        "validation_accuracy": round(float(accuracy) * 100, 2),
        "minimum_required_accuracy": 90,
        "training_rows": int(len(df))
    }, file, indent=2)

print("\nModel Saved Successfully!")
print("File: crop_recommendation_model.pkl")

# Verify what was saved
print("Saved object type:", type(pipeline))
