import json
import base64


def image_to_binary64(image_file):
    image_binary = image_file.read()
    encoded_string = base64.b64encode(image_binary)
    return encoded_string


def image_to_json(encoded_image, human_num, animal_num, vehicle_num, fps,
                  warning_human, warning_animal, warning_vehicle, warning_state, warning_change, warning_on):
    image_dict = {
        "data": encoded_image.decode(),
        "objectHuman": human_num,
        "objectAnimal": animal_num,
        "objectVehicle": vehicle_num,
        "fpsInfo": fps,
        "warningHuman": warning_human,
        "warningAnimal": warning_animal,
        "warningVehicle": warning_vehicle,
        "warningState": warning_state,
        "isChangeState": warning_change,
        "warningOn": warning_on
    }
    return json.dumps(image_dict)
