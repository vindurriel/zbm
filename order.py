#encoding=utf-8
print 'Content-Type: text/html'
print

import time
def getTime(t=None):
	if not t:t=time.time()
	res=time.strftime("%Y-%m-%d-",time.localtime(t))
	ampm=0
	if time.localtime().tm_hour>15: ampm=1
	res+=str(ampm)
	return res
import cgi
fields=cgi.FieldStorage()
u,o=None,None
if "u"  in fields :
	u= int(fields["u"].value)
if "o" in fields:
	o=fields["o"].value

def parseOrders(o):
	if not o: return {}
	orders={}
	o=o.split(",");
	if(len(o)%2): 
		print "error of o"
		exit()
	for i in range(0,len(o)/2):
		orders[int(o[2*i])]=int(o[2*i+1])
	return orders
o=parseOrders(o)
if len(o):
	#print "o:",o
	pass
import sqlite3
con=sqlite3.connect(r".\menu.db")
c=con.cursor()
save=0
t=getTime()
c.execute('''
select dishid,qty from orders where userid=%d  and time="%s" 
'''%(u,t))
db=c.fetchall()
if(not len(db) and not len(o)):
	pass
	#print "no db or o"
elif(len(db) and len(o)):
	update={}
	insert={}
	delete={}
	db=dict([(x[0],x[1]) for x in db])
	#print "db:",db
	for (dishid,qty) in o.items():
		if(dishid in db and qty!=db[dishid]):
			update[dishid]=qty
		elif(dishid not in db):
			insert[dishid]=qty
	for (dishid,qty) in db.items():
		if(dishid not in o):
			delete[dishid]=1;
	if len(insert):
		save=1
		#print "insert:",insert
		for (key,value) in insert.items():
			c.execute('''
				insert into orders values(%d,%d,%d,'%s')
				'''%(u,key,value,t))
	if len(update):
		save=1
		#print "update:",update
		for (key,value) in update.items():
			c.execute("""
				update orders set qty=%d where userid=%d and dishid=%d and time="%s"
				"""%(value,u,key,t))
	if len(delete):
		#print "delete:",delete
		save=1
		for key in delete:
			c.execute("""
				delete from orders where userid=%d and dishid=%d and time="%s"
				"""%(u,key,t))
elif not len(o):
	#print "no o"
	save=1
	db=[x[0] for x in db]
	#print "delete:",db
	for dishid in db:
		c.execute("""
			delete from orders where userid=%d and dishid=%d and time="%s"
			"""%(u,dishid,t))
else:
	#print "no db"
	save=1
	#print "insert:",o
	for (dishid,qty) in o.items():
		c.execute('''
			insert into orders values(%d,%d,%d,'%s')
			'''%(u,dishid,qty,t))
if(save): 
	con.commit()
	print "已更新"
else:
	print "无变化"
con.close()

