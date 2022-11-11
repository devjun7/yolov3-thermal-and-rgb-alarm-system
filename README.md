## yolov3-thermal-and-rgb-master
YOLO v3 object detection model both on RGB and Infrared video. When it comes to video, it puts out its result as jpg forms, which helps a server to load its result more easily.


![](example.png)
   
#### Downloads needed to run codebase
  
   1. Download pre-trained weights here: [link](https://drive.google.com/drive/folders/1dV0OmvG4eZFtnh5WF0mby-jhkVy-HVco?usp=sharing)
   
   2. FLIR Thermal Images Dataset: [Download](https://www.flir.com/oem/adas/adas-dataset-form/)

   3. Go into ```/data``` folder and unzip ```labels.zip```
   
   4. Addt'l instructions on how to run [Ultralytics Yolov3](https://github.com/ultralytics/yolov3)

#### Instructions

-  run pip install requirements, or click into the requriements.txt file for the Anaconda commands.


### Install & Run Code:

#### To detect video file
$ python detect.py --data data/coco.data --cfg cfg/yolov3.cfg --weights weights/yolov3.weights

#### To detect on webcam
$ python detect.py --data data/coco.data --cfg cfg/yolov3.cfg --weights weights/yolov3.weights --source 0
