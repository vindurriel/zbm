#encoding=utf-8
from utils import *
db=web.database(dbn='sqlite',db='menu.db')
class history:
	def GET(self):
		u=getUserId()
		if not u:
			return 'error:not loggedIn'
		dbs=db.query('''select o.time,d.name,o.qty,d.unit 
			from orders o,dish d 
			where userid=%s and o.dishid=d.rowid
			order by o.time 
			'''%u
			).list()
		times={}
		if len(dbs):
			for x in dbs:
				if x.time not in times:
					times[x.time]=[]
				unit=u"份"
				if x.unit!="None": unit=x.unit
				times[x.time].append(dict(
					x.items()
				))
		js=[]
		import json
		js.append('data = '+json.dumps(times))
		js.append(getjs('history'))
		js='\n'.join(js)
		return render('history',locals())
	
	def getUsername(self,u):
		name=db.query('''select username from user where rowid=%d'''%u).list()
		if len(name):return name[0].username
		else:return None