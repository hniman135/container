from flask import Flask, render_template , request , jsonify, send_file
from PIL import Image
import csv
import os , io , sys
import numpy as np 
import cv2
import base64
from yolo_detection_images import runModel
from datetime import datetime
last_detection_result = None
app = Flask(__name__)

############################################## THE REAL DEAL ###############################################
@app.route('/detectObject' , methods=['POST'])
def mask_image():
	global last_detection_result
	# print(request.files , file=sys.stderr)
	file = request.files['image'].read() ## byte file
	npimg = np.fromstring(file, np.uint8)
	img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
	######### Do preprocessing here ################
	# img[img > 150] = 0
	## any random stuff do here
	################################################

	img = runModel(img)

	img = Image.fromarray(img.astype("uint8"))
	rawBytes = io.BytesIO()
	img.save(rawBytes, "JPEG")
	rawBytes.seek(0)
	img_base64 = base64.b64encode(rawBytes.read())
 
	doc_path = 'D:\Learning\container\detect_result.txt'
	with open(doc_path, 'r', encoding='utf-8') as file:
		content = file.read()
	parts = content.split()
	last_detection_result = {
        'status': str(img_base64),
        'ID': parts[1],  # You can replace this with the actual ID
        'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
	response_data = {
        'status': str(img_base64),
        'ID': last_detection_result['ID'],
        'time': last_detection_result['time']
    }
	save_to_csv(response_data)
	return jsonify(response_data)

def save_to_csv(data):
    csv_path = 'D:\Learning\container\history.csv'
    fieldnames = ['ID', 'time']
    mode = 'a' if os.path.exists(csv_path) else 'w'

    with open(csv_path, mode, newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if mode == 'w':
            writer.writeheader()

        writer.writerow({'ID': data['ID'], 'time': data['time']})
##################################################### THE REAL DEAL HAPPENS ABOVE ######################################

@app.route('/test' , methods=['GET','POST'])
def test():
	print("log: got at test" , file=sys.stderr)
	return jsonify({'status':'succces'})

@app.route('/history')
def history():
    csv_path = 'D:\Learning\container\history.csv'
    data = read_csv(csv_path)
    return render_template('history.html', data=data)
    
def read_csv(csv_path):
    data = []
    if os.path.exists(csv_path):
        with open(csv_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                data.append(row)
    return data

@app.route('/')
def home():
	return render_template('./index.html')

	
@app.after_request
def after_request(response):
    print("log: setting cors" , file = sys.stderr)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


if __name__ == '__main__':
	app.run(debug = True)
