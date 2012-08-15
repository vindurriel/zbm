#encoding=utf-8
#check if the password is correct; if so, save the cookie.
import web
def end(o):
	exit()
def die(o):
	end("error:"+o)
def defined(key,vars):
	return key in vars
class user:
	def POST(self,cmd):
		web.debug(cmd)
		return self.GET(cmd)
	def GET(self,cmd):
		if hasattr(self,cmd):
			return getattr(self,cmd)()
		elif cmd=="logout":
			return self.logout()
		else:
			raise web.seeother('/')
	def __init__(self):
		self.db=web.database(dbn='sqlite',db='menu.db')
		self.userid=web.cookies().get('u')
		self.input=web.input(username="",password="")
	def logout(self):
		web.debug('user logout')
		web.setcookie('u','',expires=-1)
		raise web.seeother('/')
	def listJSON(self):
		users=self.db.select('user',
		    what='username,password',
		    order='rowid asc',
		    _test=False)
		options=[]
		if users:
		    for x in users:
		        value="false"
		        if x.password!="":value="true"
		        dic={}
		        dic["username"],dic["hasPassword"]=x.username,value
		        options.append(dic)
		import json
		return json.dumps(options)
	def new(self):
		i=web.input()
		username,password=i.username,i.password
		self.db.insert('user',username=username,password=passwordpassword)
		return 'new user created'
	def validate(self):
		i=self.input
		username,password=i.username,i.password or ""
		u=self.db.query(
			'select rowid from user where username=$username and password=$password',
			vars=locals()).list()
		if not len(u): return 'error: validation failed'
		web.setcookie('u',u[0].rowid,expires=3*60*60*24*30)
		return 'user granted'
	def delete(self):
		if not self.userid:return 'error:not logged in'
		self.db.delete('user',vars=dict(u=self.userid),where='rowid=$u')
		return 'user deleted'
if __name__ == '__main__':
	db=web.database(dbn='sqlite',db='menu.db')
	username,password=u"高 杉",""
	u=db.query('select rowid from user where username=$username and password=$password',
		vars=locals())
	items=db.query('''select rowid,name,price,unit,type,vendor,zid from dish''').list()
