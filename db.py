#encoding=utf-8
con,c=None,None
_dbpath=r".\menu.db"
def connect(dbpath=_dbpath):
	global con,c
	import sqlite3
	con=sqlite3.connect(dbpath)
	c=con.cursor()
	return 
def close():
	global con
	if con != None:
		con.close()
		c=None
def getattrs(dbname):
	connect()
	try:
		c.execute('select * from [%s]'%dbname)
		return [x[0] for x in c.description]
	except Exception, e:
		return []
	close()
class DbObject(object):
	def __init__(self):
		self._dic={}
	def set(self,key,val):
		self._dic[key]=val
		setattr(self,key,val)
	def as_dic(self):
		return self._dic
def query(cmd):
	connect()
	res=[]
	try:
		c.execute(cmd)
		raw=c.fetchall()
		props=[x[0] for x in c.description]
		for item in raw:
			o=DbObject()
			for i in range(len(props)):
				o.set(props[i],item[i])
			res.append(o)
	except Exception, e:
		return e
	return res
def commit():
	global con
	con.commit()