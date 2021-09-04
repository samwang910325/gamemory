from PIL import Image
import requests

skip = 0
for i in range(1000):
    try:
        Image.open(requests.get("https://picsum.photos/id/" + str(i) + "/1000", stream=True).raw).save("pic/" + str(i - skip) + ".jpg")
    except:
        skip += 1
    print(i)
print("skip:", skip)