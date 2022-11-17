## Human, vehicle, animal Detector on Infrared, monochrome, and RGB video with UI
YOLO v3 Human, vehicle, animal detection model both on RGB and Infrared video. It only detects Human, vehicle, and animal. And it can detect from various angle for the people who uses this model for specific purpose. For those who wants to connect this model to server it puts out its result as images in jpg forms with its file name telling what it detected and its time. And detection result is saved at the global dictionary variable named "detect_result". By that it helps a server to load its result more easily.

![](example1.png)

### Instructions

- run pip install requirements, or click into the requriements.txt file for the Anaconda commands.

- download pre-trained weight file. (https://drive.google.com/file/d/1BRJDDCMRXdQdQs6-x-3PmlzcEuT9wxJV/view?usp=sharing)

- place pre-trained weight file in weights folder.

### Run Code:

#### - To run on webcam
python detect.py --data data/coco.data --cfg cfg/yolov3.cfg --weights weights/yolov3.weights --source 0

#### - To run on video
python detect.py --data data/coco.data --cfg cfg/yolov3.cfg --weights weights/yolov3.weights

#### - To run with UI
npm install

npm update

npm start
