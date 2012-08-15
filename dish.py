#encoding=utf-8
import web
db=web.database(dbn='sqlite',db='menu.db')
def fill(html,dic):
	import re
	for k,v in dic.iteritems():
		html=re.sub('%%%s%%'%k,v,html)
	return html
def loadVendor():
	items=db.query('''select name from vendor order by rowid''').list()
	vendors=[i.name for i  in items]
	return vendors
def loadDish():
	import os
	items=db.query('''select rowid,name,price,unit,type,vendor,zid from dish''').list()
	noPath=r'/static/img/noImg.GIF'
	for x in items:
		x.imgsrc=noPath
		if x.zid!=None:
			path='static\\img\\'+x.zid+'.jpg'
			if os.path.isfile(path):
				x.imgsrc=path.replace('\\','/')
	return items

def go_login():
	print "Status: 302 Found"
	print "Location: welcome.htm"
	print
	exit()

def locked():
	try:
		with file("lock") as lock:
			if(lock.read()=="1"):
				return True
	except Exception,e:pass
	return False
def to_json(raw):
	import json
	return json.dumps(raw,sort_keys=True,indent=2).replace("\\n","")
class dish:
	def POST(self):
		return self.GET()
	def GET(self):
		userid=web.cookies().get('u')
		if not userid:
			raise web.seeother('/')
		web.debug(userid)
		username="Anonymous"
		d=db.select('user',what='username',where='rowid=%s'%userid).list()
		if len(d):
			username=d[0].username.encode("utf-8")
		global_vars=[]
		vendors=loadVendor()
		dishes=loadDish()
		admin_fn=[]
		nav_item="<a class='nav-item' href='%href%'>%name%</a>"
		if(username.decode("utf-8") in (u"admin",u"杨帆")):
			admin_fn.append(fill(nav_item,{"name":"编辑菜单","href":"/dishmod"}))
		admin_fn='\n'.join(admin_fn)
		line='vendors = %s'%to_json(vendors)
		global_vars.append(line)
		line='dishes = %s'%to_json(dishes)
		global_vars.append(line)
		global_vars="\n".join(global_vars)
		import time
		t=time.time()
		render=web.template.render('.\\template',globals=locals())
		return render.dish()