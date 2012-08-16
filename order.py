#encoding=utf-8
from utils import *
db=web.database(dbn='sqlite',db='menu.db')
class order:
	def GET(self):
		u=getUserId()
		if not u:
			return 'error:not logged in'
		t=getTime()
		dbs=db.query('''select dishid,qty from orders 
			where userid=%s  and time="%s" 
		'''%(u,t)).list()
		res=[{'dishid':x.dishid,'qty':x.qty} for x in dbs]
		import json
		return json.dumps(res,sort_keys=True)
	def POST(self):
		i=web.input()
		order=getattr(i,'order')
		if not order:
			return "error: order not found"
		import json
		order=json.loads(order)
		order=dict((x['dishid'],x['qty']) for x in order)
		return self.sync(order)
	def sync(self,order):
		global db
		u=getUserId()
		if not u:
			return 'error:not logged in'
		t=getTime()
		dbs=db.query('''
		select dishid,qty from orders where userid=%s  and time="%s" 
		'''%(u,t)).list()
		dbs=dict((unicode(x.dishid),unicode(x.qty)) for x in dbs)
		msg=""
		setDb=set(dbs.keys())
		setInput=set(order.keys())
		msg+='db:'+str(setDb)
		msg+='order:'+str(setInput)
		insert=setInput-setDb
		delete=setDb-setInput
		update=set([x for x in setDb&setInput if dbs[x]!=order[x]])
		if setDb==setInput and len(update)==0:
			return "无变化"
		if len(insert):
			msg+="insert:"+str(insert)
			for dishid in insert:
				db.query('''
					insert into orders values(%s,%s,%s,'%s')
					'''%(u,dishid,order[dishid],t))
		if len(update):
			msg+="update:"+str(update)
			for dishid in update:
				db.query("""
					update orders set qty=%s where userid=%s and dishid=%s and time="%s"
					"""%(order[dishid],u,dishid,t))
		if len(delete):
			msg+="delete:"+str(delete)
			for dishid in delete:
				db.query("""
					delete from orders where userid=%s and dishid=%s and time="%s"
					"""%(u,dishid,t))
		return "已更新 "#+msg

			