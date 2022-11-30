import argparse
from sys import platform

from models import *  # set ONNX_EXPORT in models.py
import websockets
import asyncio
import base64
import numpy
import json
import logging
import traceback
import os
from utils.datasets import *
from utils.utils import *
from datetime import datetime
from websocket import *



async def detect(websocket, path, save_txt=False, save_img=False):
    try:
        # Websocket connection
        data = await websocket.recv()
        print(data)

        # AIVersionList Send
        await websocket.send(json.dumps({
            "AIVersionList": ['v1.3', 'v1.2', 'v1.1']
        }))

        # AIVersion Receive
        AI_version = await websocket.recv()
        print(AI_version)

        # Connection Request
        connection = await websocket.recv()
        print(connection)

        fps_prevtime = 0
        warning_buf = -1

        k = ''
        # img_size = (320, 192) if ONNX_EXPORT else opt.img_size  # (320, 192) or (416, 256) or (608, 352) for (height, width)
        img_size = (320, 192)
        out, source, weights, half, view_img = opt.output, opt.source, opt.weights, opt.half, opt.view_img
        webcam = source == '0' or source.startswith('rtsp') or source.startswith('http') or source.endswith('.txt')
        _FPS = 30
        human_3s = numpy.zeros(_FPS * 3)
        animal_3s = numpy.zeros(_FPS * 3)
        vehicle_3s = numpy.zeros(_FPS * 3)
        # Initialize
        device = torch_utils.select_device(device='cpu' if ONNX_EXPORT else opt.device)
        if os.path.exists(out):
            shutil.rmtree(out)  # delete output folder
        os.makedirs(out)  # make new output folder

        # Initialize model
        model = Darknet(opt.cfg, img_size)

        # Load weights
        attempt_download(weights)
        if weights.endswith('.pt'):  # pytorch format
            model.load_state_dict(torch.load(weights, map_location=device)['model'])
        else:  # darknet format
            _ = load_darknet_weights(model, weights)

        # Second-stage classifier
        classify = False
        if classify:
            modelc = torch_utils.load_classifier(name='resnet101', n=2)  # initialize
            modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device)['model'])  # load weights
            modelc.to(device).eval()

        # Fuse Conv2d + BatchNorm2d layers
        # model.fuse()

        # Eval mode
        model.to(device).eval()

        # Export mode
        if ONNX_EXPORT:
            img = torch.zeros((1, 3) + img_size)  # (1, 3, 320, 192)
            torch.onnx.export(model, img, 'weights/export.onnx', verbose=False, opset_version=11)

            # Validate exported model
            import onnx
            model = onnx.load('weights/export.onnx')  # Load the ONNX model
            onnx.checker.check_model(model)  # Check that the IR is well formed
            print(onnx.helper.printable_graph(model.graph))  # Print a human readable representation of the graph
            return

        # Half precision
        half = half and device.type != 'cpu'  # half precision only supported on CUDA
        if half:
            model.half()

        # Set Dataloader
        vid_path, vid_writer = None, None
        if webcam:
            view_img = True
            torch.backends.cudnn.benchmark = True  # set True to speed up constant image size inference
            dataset = LoadStreams(source, img_size=img_size, half=half)
        else:
            save_img = True
            dataset = LoadImages(source, img_size=img_size, half=half)

        # Get classes and colors
        classes = load_classes(parse_data_cfg(opt.data)['names'])
        colors = [[random.randint(0, 255) for _ in range(3)] for _ in range(len(classes))]

        # Run inference
        t0 = time.time()
        for index, (path, img, im0s, vid_cap) in enumerate(dataset):
            t = time.time()

            # Get detections
            img = torch.from_numpy(img).to(device)
            if img.ndimension() == 3:
                img = img.unsqueeze(0)
            pred = model(img)[0]

            if opt.half:
                pred = pred.float()

            # Apply NMS
            pred = non_max_suppression(pred, opt.conf_thres, opt.nms_thres)

            # Apply
            if classify:
                pred = apply_classifier(pred, modelc, img, im0s)

            # Process detections
            for i, det in enumerate(pred):  # detections per image\
                if webcam:  # batch_size >= 1
                    p, s, im0 = path[i], '%g:' % i, im0s[i]
                else:
                    p, s, im0 = path, '', im0s
                k = ''
                save_path = str(Path(out) / Path(p).name)
                s += '%gx %g ' % img.shape[2:]  # print string
                flag = False
                # Initial data setting
                p_num = 0
                a_num = 0
                v_num = 0
                if det is not None and len(det):
                    # Rescale boxes from img_size to im0 size
                    det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()

                    # Print results
                    for c in det[:, -1].unique():
                        if  save_img or view_img and int(c) <= 8 or (14 <= int(c) and int(c) <= 23):
                            n = (det[:, -1] == c).sum()  # detections per class
                            s += '%g %ss, ' % (n, classes[int(c)])  # add to string
                            k += '_%g%s' % (n, classes[int(c)])
                            if classes[int(c)] == "person":
                                p_num = int(n)
                            elif classes[int(c)] == "animal":
                                a_num = int(n)
                            elif classes[int(c)] == "vehicle":
                                v_num = int(n)
                        else:
                            n = (det[:, -1] == c).sum()  # detections per class
                            s += '%g %ss, ' % (n, classes[int(c)])  # add to string
                            k += '_%g%s' % (n, classes[int(c)])

                    # Write results
                    for *xyxy, conf, _, cls in det:
                        label = '%s %.2f' % (classes[int(cls)], conf)
                        plot_one_box(xyxy, im0, label=label, color=colors[int(cls)])
                        if save_txt:  # Write to file
                            with open(save_path + '.txt', 'a') as file:
                                file.write(('%g ' * 6 + '\n') % (*xyxy, cls, conf))
                        if save_img or view_img and (int(c) <= 8 or (14 <= int(c) and int(c) <= 23)):  # Add bbox to image
                            flag = True
                    if flag:
                        now = datetime.now()
                        buf = 'output/%d-%d-%d--%d-%d-%d-%d%s.jpg' % (now.year, now.month, now.day, now.hour, now.minute, now.second, now.microsecond, k)
                        plot_one_box(xyxy, im0, label=label, color=colors[int(cls)])
                        # cv2.imwrite(buf, im0)
                        print('%s Done. (%.3fs)' % (s, time.time() - t))
                    else:
                        now = datetime.now()
                        buf = 'output/%d-%d-%d--%d-%d-%d-%d.jpg' % (now.year, now.month, now.day, now.hour, now.minute, now.second, now.microsecond)
                        # cv2.imwrite(buf, im0)
                        print('Done. (%.3fs)' % (time.time() - t))
                elif det is None:
                    now = datetime.now()
                    buf = 'output/%d-%d-%d--%d-%d-%d-%d.jpg' % (now.year, now.month, now.day, now.hour, now.minute, now.second, now.microsecond)
                    # cv2.imwrite(buf, im0)
                    print('Done. (%.3fs)' % (time.time() - t))
                # print('%s Done. (%.3fs)' % (s, time.time() - t))
                # Stream results
                if view_img:
                #    cv2.imshow(p, im0)
                    pass
                    
                # Save results (image with detections)
                if save_img:
                    if dataset.mode == 'images':
                        cv2.imwrite(save_path, im0)
                    else:
                        if vid_path != save_path:  # new video
                            vid_path = save_path
                            if isinstance(vid_writer, cv2.VideoWriter):
                                vid_writer.release()  # release previous video writer
                
                        fps = vid_cap.get(cv2.CAP_PROP_FPS)
                        w = int(vid_cap.get(cv2.CAP_PROP_fps_WIDTH))
                        h = int(vid_cap.get(cv2.CAP_PROP_fps_HEIGHT))
                        vid_writer = cv2.VideoWriter(save_path, cv2.VideoWriter_fourcc(*opt.fourcc), fps, (w, h))
                        vid_writer.write(im0)

            # Warning(RTX 3070 max accurate:0.80)
            warning_change = 0

            if p_num != 0:
                human_3s[index % (_FPS * 3)] = 1
            else:
                human_3s[index % (_FPS * 3)] = 0
            if a_num != 0:
                animal_3s[index % (_FPS * 3)] = 1
            else:
                animal_3s[index % (_FPS * 3)] = 0
            if v_num != 0:
                vehicle_3s[index % (_FPS * 3)] = 1
            else:
                vehicle_3s[index % (_FPS * 3)] = 0
            if numpy.average(human_3s) > 0.2:
                warning_human = 1
            else:
                warning_human = 0
            if numpy.average(animal_3s) > 0.2:
                warning_animal = 1
            else:
                warning_animal = 0
            if numpy.average(human_3s) > 0.2:
                warning_vehicle = 1
            else:
                warning_vehicle = 0
            if warning_human + warning_animal + warning_vehicle > 0:
                warning_state = 1
                warning_on = 1
                if warning_buf != warning_state:
                    warning_change = 1
            elif p_num != 0 or a_num != 0 or v_num != 0:
                warning_state = 0
                warning_on = 0
                if warning_buf != warning_state:
                    warning_change = 1
            else:
                warning_state = -1
                warning_on = 0
                if warning_buf != warning_state:
                    warning_change = 1
            warning_buf = warning_state


            # print(numpy.average(human_3s))
            # Send image
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 100]
            result, imgencode = cv2.imencode('.jpg', im0, encode_param)
            encoded_img = numpy.array(imgencode)
            stringData = base64.b64encode(encoded_img)
            if fps_prevtime == 0:
                fps = 0
            else:
                fps_curtime = time.time()
                # print("curtime: ", fps_curtime)
                fps = int(1 / (fps_curtime - fps_prevtime))

            jsonData = image_to_json(stringData, p_num, a_num, v_num, fps, warning_human, warning_animal,
                                     warning_vehicle, warning_state, warning_change, warning_on)
            await websocket.send(jsonData)
            _data = await websocket.recv()
            # print(_data)
            if _data == "AIVersion":
                AI_version = await websocket.recv()
                print(AI_version)
            if _data == 'exit':
                print("client disconnected")
                break
            fps_prevtime = time.time()
            # print("prevtime: ", fps_prevtime)
        if save_txt or save_img:
            print('Results saved to %s' % os.getcwd() + os.sep + out)
            if platform == 'darwin':  # MacOS
                os.system('open ' + out + ' ' + save_path)
            print('Done. (%.3fs)' % (time.time() - t0))
    except Exception as e:
        logging.error(traceback.format_exc())


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cfg', type=str, default='cfg/yolov3-spp.cfg', help='cfg file path')
    parser.add_argument('--data', type=str, default='data/coco.data', help='coco.data file path')
    parser.add_argument('--weights', type=str, default='weights/yolov3-cpp.weights', help='path to weights file')
    parser.add_argument('--source', type=str, default='data/samples', help='source')  # input file/folder, 0 for webcam
    parser.add_argument('--output', type=str, default='output', help='output folder')  # output folder
    parser.add_argument('--img-size', type=int, default=416, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.3, help='object confidence threshold')
    parser.add_argument('--nms-thres', type=float, default=0.5, help='iou threshold for non-maximum suppression')
    parser.add_argument('--fourcc', type=str, default='mp4v', help='output video codec (verify ffmpeg support)')
    parser.add_argument('--half', action='store_true', help='half precision FP16 inference')
    parser.add_argument('--device', default='', help='device id (i.e. 0 or 0,1) or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    opt = parser.parse_args()
    print(opt)

    with torch.no_grad():
        print("connect waiting...")

        start_server = websockets.serve(detect, "localhost", 5000); # waits server
        asyncio.get_event_loop().run_until_complete(start_server);
        asyncio.get_event_loop().run_forever();

