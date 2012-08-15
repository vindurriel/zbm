#encoding=utf-8
import web
def render(tname,globals={}):
	r=web.template.render('.\\template',globals=globals)
	return getattr(r,tname)()
def getUserId():
	u=web.cookies().get('u')
	if u is None or u=="":
		return None
	return u
def getjs(classname):
	jsfile='.\\static\\js\\%s.js'%classname
	import os
	if os.path.isfile(jsfile):
		return file(jsfile,'r').read()
	else:
		return ""