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
		return self.GET(cmd)
	def GET(self,cmd):
		if cmd=='new':
			return self.new()
		elif cmd=='validate':
			return self.validate()
		elif cmd=='delete':
			return self.delete()
		elif cmd=='listJSON':
			return self.listJSON()
		else:
			raise web.seeother('/')
	def __init__(self):
		self.db=web.database(dbn='sqlite',db='menu.db')
		self.userid=web.cookies().get('u')
		self.input=web.input(username="",password="")
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
	def chpwd(self):
		if not self.userid:return 'error:not logged in'
		dic={
			'u':self.userid,
			'p':self.input.password
		}
		granted=self.db.select('user',vars=locals(),where="rowid = $u and password='$p'")
		if not granted:
			return 'error:password incorrect'
		self.db.update('user',password=self.input.newpass,where="rowid = $u")
		return 'password changed'
if __name__ == '__main__':
	db=web.database(dbn='sqlite',db='menu.db')
	username,password=u"高 杉",""
	u=db.query('select rowid from user where username=$username and password=$password',
		vars=locals())
	items=db.query('''select rowid,name,price,unit,type,vendor,zid from dish''').list()
