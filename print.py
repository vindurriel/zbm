#encoding=utf-8
import os
print('Content-Type: text/html')
print
filepath=os.path.realpath("./result.htm")
#print filepath
if not os.path.exists(filepath): exit()
ffpath="E:\\tools\\MozillaFirefox\\firefox.exe"
print ffpath
if not os.path.exists(ffpath): exit()
cmd="\"%s\" -print \"%s\" -printmode pdf -printfile \"c:\\a.pdf\""%(ffpath,filepath)
import subprocess
#os.system("\""+cmd+"\"")
subprocess.call([cmd])