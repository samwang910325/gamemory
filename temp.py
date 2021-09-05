from PIL import Image
import requests
import sys

f = open("temp.txt", "r")
count = 2499
while True:
    url = f.readline()[:-1]
    if not url:
        break
    try:
        img = Image.open(requests.get(url, stream=True).raw)
        width = img.size[0]
        height = img.size[1]
        if width > height:
            d = (width - height) // 2
            box = (d, 0, width - d, height)
        else:
            d = (height - width) // 2
            box = (0, d, width, height - d)
        img.crop(box).resize((1000, 1000)).save("pic/" + str(count) + ".jpg")
        print(count, url)
        count += 1
    except:
        continue
f.close()