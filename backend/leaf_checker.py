"""Offline plant-leaf gate used before disease classification.

It rejects ordinary/random images locally, then lets the PlantVillage model
classify only images with a substantial connected leaf-colour region.
"""
import numpy as np
from PIL import Image

try:
    import cv2
except ImportError:
    cv2 = None

try:
    from ultralytics import YOLO
    _object_model = YOLO("yolov8n.pt")
except Exception:
    _object_model = None

NON_PLANT_CLASSES = {
    "person", "bird", "cat", "dog", "horse", "sheep", "cow", "elephant",
    "bear", "zebra", "giraffe"
}


def is_leaf(image_path):
    try:
        # Reject people and animals first.  This check runs locally using the
        # existing YOLO model, before any crop/disease classifier is invoked.
        if _object_model is not None:
            detections = _object_model(image_path, verbose=False)[0]
            for class_id, confidence in zip(detections.boxes.cls.tolist(), detections.boxes.conf.tolist()):
                label = _object_model.names[int(class_id)]
                if label in NON_PLANT_CLASSES and confidence >= 0.35:
                    return {
                        "is_leaf": False,
                        "plant_name": "",
                        "reason": f"Detected non-plant subject: {label}"
                    }

        image = Image.open(image_path).convert("RGB")
        image.thumbnail((640, 640))
        pixels = np.asarray(image, dtype=np.float32)
        red, green, blue = pixels[:, :, 0], pixels[:, :, 1], pixels[:, :, 2]

        # Green healthy tissue plus yellow/brown tissue that commonly appears
        # on diseased leaves.  The latter still requires nearby leaf-green
        # pixels, preventing a brown object from passing by itself.
        healthy_green = (green > 48) & (green > red * 1.05) & (green > blue * 1.08)
        diseased_tone = (red > 60) & (green > 38) & (red > blue * 1.18) & (green < red * 1.12)
        leaf_mask = healthy_green | (diseased_tone & (healthy_green.mean() > 0.02))

        coverage = float(leaf_mask.mean())
        if coverage < 0.06:
            return {"is_leaf": False, "plant_name": "", "reason": "No visible plant-leaf region detected"}

        if cv2 is not None:
            mask = (leaf_mask.astype(np.uint8) * 255)
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
            count, _, stats, _ = cv2.connectedComponentsWithStats(mask)
            largest_region = max((stats[index, cv2.CC_STAT_AREA] for index in range(1, count)), default=0)
            connected_coverage = largest_region / float(mask.size)
            if connected_coverage < 0.035:
                return {"is_leaf": False, "plant_name": "", "reason": "Plant-leaf shape not detected"}

        return {"is_leaf": True, "plant_name": "", "reason": "Plant leaf detected locally"}
    except Exception as error:
        return {"is_leaf": False, "plant_name": "", "reason": f"Invalid image: {error}"}
