import os

path = "pic/"
allfile = os.listdir(path)
allfile.sort()
output = ""
skip = ["blank.jpg", "temp", ".DS_Store"]
for i in range(len(allfile)):
    if allfile[i] in skip:
        continue
    c = int(os.popen("ls " + path + allfile[i] + " | wc -l").read())
    output += allfile[i] + ": " + str(c)
    if i != len(allfile) - 1:
        output += ",\n"
print(output)
