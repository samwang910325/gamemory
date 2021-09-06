import os
from PIL import Image

path = "animal"
allfile = os.listdir(path + "/")
count = 0
for file in allfile:
    try:
        Image.open(path + "/" + file).save("_" + path + "/" + str(count) + ".jpg")
        count += 1
    except:
        continue