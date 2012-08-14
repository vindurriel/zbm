#encoding=utf-8
def die():
	print 'Status: 302 Found'
	print 'Location:', "main.py"
	print 
	exit()
import sqlite3
con=sqlite3.connect(r".\menu.db")
c=con.cursor()
import Cookie
import os
cookies = Cookie.SimpleCookie(os.environ.get("HTTP_COOKIE",""))
u=None
if not cookies.has_key("u"):
	die()
try:u=int(cookies["u"].value)
except:die()
def parseTime(s):
	s=s.split("-")
	if s[-1]=="0": s[-1]=u"中午"
	else:s[-1]=u"晚上"
	if s[1][0]=="0":s[1]=s[1][1:]
	if s[2][0]=="0":s[2]=s[2][1:]
	return u"%4s年%2s月%2s日%s:"%tuple(s)
def getUsername(u,c):
	c.execute('''select username from user where rowid=%d'''%u)
	name=c.fetchone()
	if len(name):return name[0]
	else:return None
def getHistory(u,c):
	c.execute('''select o.time,d.name,o.qty,d.unit from orders o,dish d where userid=%d and o.dishid=d.rowid'''%u)
	db=c.fetchall()
	times={}
	if len(db):
		for x in db:
			if x[0] not in times:
				times[x[0]]={}
			unit=u"份"
			if x[3]!="None": unit=x[3]
			times[x[0]][x[1]]=(u"%3d %s"%(x[2],unit)).encode("utf-8")
	return times
username=getUsername(u,c)
db=getHistory(u,c)
print 'Content-Type: text/html'
print
print( "<head>")
print( '<meta http-equiv="Content-Type" content="text/html;charset=utf-8">')
print( '<title>订餐历史</title>')
print( "</head>")
print '<a  href="main.py">返回</a>'
if len(db)>0:
	for t,a in sorted(db.items()):
		print '<h2>'
		print parseTime(t).encode("utf-8")
		print '</h2>'
		for dish,qty in a.items():
			print '%s %s<br>'%(qty,dish.encode("utf-8"))