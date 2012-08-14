#encoding=utf-8

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
u,t="",""
if "u"  in fields :
	u= int(fields["u"].value)
if "t" in fields:
	t=fields["t"].value
t=getTime()
def load_order(u,t):
	import sqlite3
	con=sqlite3.connect(r".\menu.db")
	c=con.cursor()
	c.execute('''
	select dishid,qty from orders where userid=%d  and time="%s" 
	'''%(u,t))
	orders=c.fetchall()
	con.close()
	options={}
	if len(orders):
		options=dict([(x[0],x[1]) for x in orders])
	return options
options=load_order(u,t)
print 'Content-Type: text/html'
print
output=str(options).replace("u\'","\'")
print output