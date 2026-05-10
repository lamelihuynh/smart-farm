import time
import config
import requests
from adafruit_handler import AdafruitGateway
from serial_handler import YoloSerial

current_pump = 0
last_publish = 0

# Cấu hình URL Backend
BACKEND_URL = "http://localhost:5001/api/sensor/data"

def handle_message(client, feed_id, payload):
    global current_pump
    print(f"[CLOUD] Lệnh: {feed_id} -> {payload}")
    if feed_id == config.FEED_PUMP:
        current_pump = int(payload)
        yolo.send_command("PUMP", current_pump)
    elif feed_id == config.FEED_RELAY:
        yolo.send_command("RELAY", int(payload))

yolo = YoloSerial(config.BAUD_RATE) 
ada = AdafruitGateway(handle_message)

while True:
    ada.loop()
    data = yolo.read_full_data()
    
    if data:
        now = time.time()
        
        # Gửi dữ liệu định kỳ mỗi 30 giây
        if now - last_publish > 30: 
            # 1. GỬI DỮ LIỆU VÀO DATABASE THÔNG QUA BACKEND
            payload = {
                "deviceId": 1, # ID thiết bị khớp với bảng 'device' trong SQL
                "T": data.get('T'),
                "H": data.get('H'),
                "S": data.get('S'),
                "L": data.get('L')
            }
            try:
                # Gửi yêu cầu POST lên Backend
                requests.post(BACKEND_URL, json=payload, timeout=2)
                print(f"[BACKEND] Đã đẩy dữ liệu vào Database qua BE")
            except Exception as e:
                print(f"[BACKEND] Lỗi kết nối BE: {e}")

            # 2. GỬI LÊN ADAFRUIT
            ada.publish_all(data)
            
            # 3. CẬP NHẬT LCD
            t, s = data.get('T', 0), data.get('S', 0)
            p_st = "ON" if current_pump == 1 else "OFF"
            lcd_msg = f"[P:{p_st}] T:{t} H:{data.get('H',0)} | S:{s} L:{data.get('L',0)}"
            ada.client.publish(config.FEED_LCD, lcd_msg)
            
            last_publish = now

    time.sleep(0.1)