#encoding=utf-8
import os
downloadfile=".\\get_dish_pic.txt"
urlbase="http://www.zbmf.net"
htmlfile=".\\get_pic.htm"
downloadpath=".\img"
downloads=[]
if os.path.isfile(downloadfile):
	os.remove(downloadfile)

if os.path.isfile(downloadfile):
	with open(downloadfile) as f: 
		downloads=[l.split() for l in f.readlines()]
else:
	html=""
	if os.path.isfile(htmlfile):
		with open(htmlfile) as f: html=f.read()
	else:
		import urllib2
		html=urllib2.urlopen(urlbase).read()
		with open(htmlfile,'w') as f:
			f.write(html)
	from BeautifulSoup import BeautifulSoup
	soup=BeautifulSoup(html)
	items=soup.findAll("div","showItem_all_wrapper")
	out=[]
	for x in items:
		id=x['id'][len('subItemWrapper_'):]
		src=x.find("img")['src']
		name=x.find("img")['alt']
		out.append(" ".join([name,id,src]))
	open(downloadfile,'w').write(u"\n".join(out).encode("utf-8"))
	downloads=[l.split() for l in out]
if not os.path.isdir(downloadpath):
	import os
	os.makedirs(downloadpath)
from download import download
for x in downloads:
	name,id,src=x[0],x[1],x[2]
	url=urlbase+src
	ext=src[src.rindex('.'):]
	path=os.path.join(downloadpath,id+ext)
	if os.path.isfile(path):
		pass
	else:
		print "downloading",id
		download(url,path)

