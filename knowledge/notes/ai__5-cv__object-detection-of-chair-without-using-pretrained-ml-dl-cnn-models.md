```python
import cv2 as cv
```

```python
image=cv.imread('/workspaces/ML--DL--NOTES/5.CV/Real_image_14th.jpg')
```

```python
import cv2
import torch
from ultralytics import YOLO
import matplotlib.pyplot as plt

# Load the YOLOv8 model
model = YOLO("yolov8n.pt")  # You can use yolov8s.pt or yolov8m.pt for better accuracy

# Load the image
image_path = "/workspaces/ML--DL--NOTES/5.CV/Real_image_14th.jpg"
image = cv2.imread(image_path)
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Perform inference
results = model(image_rgb)

# Draw bounding boxes
for result in results:
    for box in result.boxes:
        class_id = int(box.cls)
        if model.names[class_id] == "chair":  # Check if detected object is a chair
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(image, "Chair", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Display the image
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis("off")
plt.show()
```

```result title="Error"
---------------------------------------------------------------------------
ModuleNotFoundError                       Traceback (most recent call last)
Cell In[15], line 3
      1 import cv2
      2 import torch
----> 3 from ultralytics import YOLO
      4 import matplotlib.pyplot as plt
      6 # Load the YOLOv8 model

ModuleNotFoundError: No module named 'ultralytics'
```
