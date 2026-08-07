from ultralytics import YOLO


model = YOLO(
    "models/yolov8n.pt"
)


result = model(
    "leaf.jpg"
)


result[0].show()