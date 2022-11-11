## yolov3-thermal-and-rgb-master
YOLO v3 object detection model both on RGB and Infrared video. When it comes to video, it puts out its result as jpg forms, which helps a server to load its result more easily.


![](example.png)
   
### Instructions

-  run pip install requirements, or click into the requriements.txt file for the Anaconda commands.


### Install & Run Code:

#### To detect video file
$ python detect.py --data data/coco.data --cfg cfg/yolov3.cfg --weights weights/yolov3.weights

#### To detect on webcam
$ python detect.py --data data/coco.data --cfg cfg/yolov3.cfg --weights weights/yolov3.weights --source 0
