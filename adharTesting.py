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

AWS_URL = str(sys.argv[1])
l= AWS_URL.split('/')
fileName = l[-1]
imgpath = urllib.request.urlretrieve(AWS_URL,fileName)
ENDPOINT_URL = 'https://vision.googleapis.com/v1/images:annotate'
api_key = 'AIzaSyCzPvON735JrR-XUBjpaEB7wm3ijJtpn_o'
img_req = None
details = {
        'name':'',
        'aadhar':'',
        'dob':'',
        'gender': '',
        'location':''
    }
name_flag=0
gender_flag=0

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

### for gender    
    if item=="Male" or item=="MALE":
            details["gender"] = "Male"
            continue
    elif item=="Female" or item=="FEMALE":
            details["gender"] = "Female"
            continue


    if (item.upper() not in ["","GOVERNMENT","OF","INDIA", "GOVERNMENT OF INDIA"]):

### for name
        if  (item.isalpha() and item!="" and name_flag==0):
            res=""
            item = result[index]["description"]
            while (bool(re.match("^[A-Za-z]*$", item )) and item.upper() not in ["DOB","DOB:","DOB :"]):
                res = res + item + " "
                index = index + 1
                item = result[index]["description"]
                name_flag=1
            details['name'] = res

### for dob
        elif re.findall('\d{2}\/\d{2}\/\d{4}',item) :
            if item=="Year" or item=="YEAR":
                index += 4
                details['dob'] = result[index]["description"]
            else:
                details['dob'] = item

### for aadhar number
        elif (re.findall("[0-9]{4}",item)):
            val =  index -1
            if(result[val]["description"]!=":"):
                details['aadhar'] +=item

details['name']     = details['name'].strip()
details['dob']      = details['dob'].strip()
details['aadhar']   = details['aadhar'].strip()
details['gender']   = details['gender'].strip()
details['location'] = AWS_URL.strip()


print(details['name'] + "\n" + details['aadhar'] + '\n' + details['dob'] + '\n' + details["gender"] + '\n' + details['location'], end="")
#print(details)