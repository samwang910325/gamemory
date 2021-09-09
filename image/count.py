import os

path = "pic/"
allfile = os.listdir(path)
allfile.sort()
output = ""
skip = ["blank.jpg", "temp", ".DS_Store"]
print("const categoryNum = {")
for i in range(len(allfile)):
    if allfile[i] in skip:
        continue
    c = len(os.listdir(path + allfile[i]))
    output += "  " + allfile[i] + ": " + str(c)
    if i != len(allfile) - 1:
        output += ",\n"
print(output)
print("};")
