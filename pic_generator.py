from PIL import Image
import requests
import sys

#picsum
skip = 0
for i in range(1100):
    try:
        Image.open(requests.get("https://picsum.photos/id/" + str(i) + "/1000", stream=True).raw).save("pic/" + str(i - skip) + ".jpg")
        print(i - skip, "https://picsum.photos/id/" + str(i) + "/1000")
    except:
        skip += 1
print("skip:", skip)

#unsplash
f = open("url.txt", "r")  # https://unsplash.com/data
count = i + 1 - skip
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