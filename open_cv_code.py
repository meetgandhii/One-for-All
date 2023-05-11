#Import Statements

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
import tensorflow as tf
import cv2
import mediapipe as mp
from keras.models import load_model
import numpy as np
import time
import pandas as pd

# Loading the model

model = load_model('CNNmodel.h5')

word = ""

# Defining Functions

def keras_predict(model, image):
    data = np.asarray( image, dtype="int32" )
    
    pred_probab = model.predict(data)[0]
    pred_class = list(pred_probab).index(max(pred_probab))
    return max(pred_probab), pred_class

def prediction(pred):
    return(chr(pred+ 65))

def crop_image(image, x_min, y_min, x_max, y_max):
    return image[y_min:y_max, x_min:x_max]
mphands = mp.solutions.hands
hands = mphands.Hands()
mp_drawing = mp.solutions.drawing_utils
cap = cv2.VideoCapture(0)

_, frame = cap.read()

h, w, c = frame.shape

img_counter = 0
analysisframe = ''
letterpred = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y','Z','del','nothing','space']
while True:
    _, frame = cap.read()
    
    k = cv2.waitKey(1)

    if k%256 == 27:
        # ESC pressed
        print("Escape hit, closing...")
        print("Word is : ",str(word))
        break
    elif k%256 == 33:
        # SPACE pressed
        analysisframe = frame
        showframe = analysisframe
        cv2.imshow("Frame", showframe)
        framergbanalysis = cv2.cvtColor(analysisframe, cv2.COLOR_BGR2RGB)
        resultanalysis = hands.process(framergbanalysis)
        hand_landmarksanalysis = resultanalysis.multi_hand_landmarks
        if hand_landmarksanalysis:
            for handLMsanalysis in hand_landmarksanalysis:
                x_max = 0
                y_max = 0
                x_min = w
                y_min = h
                for lmanalysis in handLMsanalysis.landmark:
                    x, y = int(lmanalysis.x * w), int(lmanalysis.y * h)
                    if x > x_max:
                        x_max = x
                    if x < x_min:
                        x_min = x
                    if y > y_max:
                        y_max = y
                    if y < y_min:
                        y_min = y
                y_min -= 20
                y_max += 20
                x_min -= 20
                x_max += 20 
        

        print(analysisframe.shape[:2])
        nlist = []
        rows,cols = analysisframe.shape[0],
        for i in range(rows):
            for j in range(cols):
                k = analysisframe[i,j]
                nlist.append(k)
        
        datan = pd.DataFrame(nlist).T
        colname = []
        for val in range(784):
            colname.append(val)
        datan.columns = colname

        pixeldata = datan.values
        pixeldata = pixeldata / 255
        pixeldata = pixeldata.reshape(-1,28,28,1)
        prediction = model.predict(pixeldata)
        predarray = np.array(prediction[0])
        letter_prediction_dict = {letterpred[i]: predarray[i] for i in range(len(letterpred))}
        predarrayordered = sorted(predarray, reverse=True)
        high1 = predarrayordered[0]
        high2 = predarrayordered[1]
        high3 = predarrayordered[2]
        for key,value in letter_prediction_dict.items():
            if value==high1:
                print("Predicted Character 1: ", key)
                print('Confidence 1: ', 100*value)
            elif value==high2:
                print("Predicted Character 2: ", key)
                print('Confidence 2: ', 100*value)
            elif value==high3:
                print("Predicted Character 3: ", key)
                print('Confidence 3: ', 100*value)
        time.sleep(5)
    elif k%256 == 32:
        word +=curr
        print(word)
    framergb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(framergb)
    hand_landmarks = result.multi_hand_landmarks
    if hand_landmarks:
        for handLMs in hand_landmarks:
            x_max = 0
            y_max = 0
            x_min = w
            y_min = h
            for lm in handLMs.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                if x > x_max:
                    x_max = x
                if x < x_min:
                    x_min = x
                if y > y_max:
                    y_max = y
                if y < y_min:
                    y_min = y
            y_min -= 20
            y_max += 20
            x_min -= 20
            x_max += 20


            # For CNN Model

            # cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            # im2 = crop_image(frame, x_min,y_min,x_max,y_max)
            # cv2.imshow("Hand Image",im2)
            # image_grayscale = cv2.cvtColor(im2, cv2.COLOR_BGR2GRAY)
        
            # image_grayscale_blurred = cv2.GaussianBlur(image_grayscale, (15,15), 0)
            # im3 = cv2.resize(image_grayscale_blurred, (28,28), interpolation = cv2.INTER_AREA)

            # im4 = np.resize(im3, (28, 28, 1))
            # im5 = np.expand_dims(im4, axis=0)

            # pred_probab, pred_class = keras_predict(model, im5)
            # curr = prediction(pred_class)
            # print(curr)

            
            # For VGG-16 Model

            cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
            im2 = crop_image(frame, x_min,y_min,x_max,y_max)
            cv2.imshow("Hand Image",im2)

            im3 = cv2.resize(im2, (224,224), interpolation = cv2.INTER_AREA)
            im4 = np.resize(im3, (224, 224, 3))


            pred_probab, pred_class = keras_predict(model, im4)
            curr = prediction(pred_class)
            print(curr)
            
            # analysisframe = analysisframe[y_min:y_max, x_min:x_max]
            # analysisframe = cv2.resize(analysisframe,(28,28))
            # ana = np.resize(frame, (300,300,3))
            # image_grayscale = cv2.cvtColor(ana, cv2.COLOR_BGR2GRAY)
            

            
    cv2.imshow("Frame", frame)

cap.release()
cv2.destroyAllWindows()

