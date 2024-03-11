from pymongo import MongoClient
from flask import Flask, Response
import os
from bson.binary import Binary
import gridfs
import matplotlib.pyplot as plt
import io
from PIL import Image

import base64

from flask_database import info



def write_base(data):
    client = MongoClient('mongodb://localhost:27017/')
    db = client.flask_database

    for el in data:
        db.students.insert_one(el)
    
write_base(info)


def read_base():
    client = MongoClient('mongodb://localhost:27017/')
    db = client.flask_database

    images = db.images
    image_bs = (images.find_one())['image']
    print((image_bs))
    with open("text.txt", "wb") as f:
        f.write(image_bs)

    with open("test2.png", "wb") as fimage:
        fimage.write(image_bs.decode('base64'))


#read_base()

