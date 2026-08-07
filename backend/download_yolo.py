from ultralytics import YOLO


# Download pretrained YOLOv8 model

model = YOLO("yolov8n.pt")


print("YOLOv8 model downloaded successfully")