#encoding=utf-8
from utils import *
class view:
	def GET(self):
		title="订餐单"
		js=[]
		js.append("data = "+self.getOrdersByTime())
		# js.append(getjs('view'))
		js='\n'.join(js)
		return render('view',locals())
	def getOrdersByTime(self,t=None):
		t=getTime()
		orders=[]
		prices={}
		usernames={}
		dishnames={}
		import db
		dbs=db.query("""select o.userid,o.dishid,o.qty,u.username,
								d.name as dishname,d.price,d.vendor as vendorid,d.unit,
								v.name as vendorname,v.contact
								from orders o,dish d,user u,vendor v
								where time="%s" 
								and o.dishid=d.rowid 
								and o.userid=u.rowid
								and d.vendor=v.rowid
							"""%t)
		for i in dbs:
			self.vendorMapper(i)
			self.userMapper(i)
		import json
		return json.dumps(self.data,indent=2)
	def vendorMapper(self,x):
		if not hasattr(self,'data'):
			self.data={}
		if 'vendors' not in self.data:
			self.data['vendors']={}
		vendors=self.data['vendors']
		if x.vendorid not in vendors:
			vendors[x.vendorid]={
				'vendorname':x.vendorname,
				'contact':x.contact,
				'dishes':{},
				'sum':0,
			}
		vendor=vendors[x.vendorid]
		if x.dishid not in vendor['dishes']:
			vendor['dishes'][x.dishid]={
				'dishname':x.dishname,
				'unit':x.unit,
				'qty':0
			}
		dish=vendor['dishes'][x.dishid]

		#reducer
		dish['qty']+=int(x.qty)
		vendor['sum']+=int(x.qty) * float(x.price)
	def userMapper(self,x):
		if not hasattr(self,'data'):
			self.data={}
		if 'users' not in self.data:
			self.data['users']={}
		users=self.data['users']
		if x.userid not in users:
			users[x.userid]={
				'username':x.username,
				'dishes':{},
				'sum':0,
			}
		user=users[x.userid]
		if x.dishid not in user['dishes']:
			user['dishes'][x.dishid]={
				'dishname':x.dishname,
				'unit':x.unit,
				'qty':0
			}
		dish=user['dishes'][x.dishid]
		
		#reducer
		dish['qty']+=int(x.qty)
		user['sum']+=int(x.qty) * float(x.price)