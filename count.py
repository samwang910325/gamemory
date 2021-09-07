import os

allfile = os.listdir("./")
allfile.sort()
output = ""
skip = ["blank.jpg", "temp", ".DS_Store"]
for file in allfile:
    if file in skip:
        continue
    c = int(os.popen("ls " + file + " | wc -l").read())
    if output:
        output += ", "
    output += file + ": " + str(c)
print(output)
