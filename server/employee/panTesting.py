from unittest import result
import cv2
import imutils
import json
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import requests
import time
from base64 import b64encode
from IPython.display import Image
from pylab import rcParams
import re
import sys
import urllib.request

l=[]
l= "AWS_URL".split('/')
fileName = l[-1]
imgpath = urllib.request.urlretrieve("AWS_URL",fileName)
ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
api_key = 'AIzaSyCzPvON735JrR-XUBjpaEB7wm3ijJtpn_o'
img_req = None

details = {
        'name':'',
        'pan':'',
        'dob':''
    }
name_flag=0

with open(fileName, 'rb') as f:
    ctxt = b64encode(f.read()).decode()
    img_req = {
        'image': {
            'content': ctxt
        },
        'features': [{
            'type': 'DOCUMENT_TEXT_DETECTION',
            'maxResults': 1
        }]
    }

imgdata = json.dumps({"requests" : img_req}).encode()

result = requests.post(ENDPOINT_URL,  data= imgdata,  params = { 'key' : api_key},  headers = {'Content-type' : 'application/json'})

if result.status_code != 200 or result.json().get('error'):
    print ("Error")
else:
    result = result.json()['responses'][0]['textAnnotations']

for index in range(1,len(result)):
    item = result[index]["description"]
    if  (item=="Name" and name_flag==0):
            res=""
            index = index + 1
            item = result[index]["description"]
            while (bool(re.match("^[A-Za-z0-9]*$", item ))):
                res = res + item + " "
                index = index + 1
                item = result[index]["description"]
            details['name'] = res
            name_flag=1
    
    elif re.findall("[A-Z]{5}[0-9]{4}[A-Z]{1}",item):
            details['pan'] =item
                
    elif re.findall('\d{2}\/\d{2}\/\d{4}',item) :
            details['dob'] = item

print("\n*********************\n\n", details, "\n\n\n*********************\n")


