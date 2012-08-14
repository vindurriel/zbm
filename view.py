#encoding=utf-8
def locked():
	try:
		with file("lock") as lock:
			if(lock.read()=="1"):
				return True
	except Exception,e:pass
	return False
def printf(x=""):
	global fout
	print x
	fout+=x+"\n"
fout=""
print( 'Content-Type: text/html')
print
def getPrice(dishid):
	global prices
	return float(prices[dishid])
def getUserName(userid):
	global usernames
	return usernames[userid].encode("utf-8")
def getDishName(dishid):
	global usernames
	return dishnames[dishid].encode("utf-8")
def getVendorName(vendorid):
	global vendors
	return vendors[vendorid-1][0].encode("utf-8")
def getContact(vendorid):
	global vendors
	return vendors[vendorid-1][1].replace("\n","<br>").encode("utf-8")
def loadVendor(c):
	c.execute('''select name,contact from vendor order by rowid''')
	items=c.fetchall()
	vendors=[(i[0],i[1])for i  in items]
	return vendors
import time
def getTime(t=None):
	if not t:t=time.time()
	res=time.strftime("%Y-%m-%d-",time.localtime(t))
	ampm=0
	if time.localtime().tm_hour>15: ampm=1
	res+=str(ampm)
	return res
class order:
	def __init__(self,u,d,q,v):
		self.userid,self.dishid,self.qty,self.vendor=u,d,q,v
def getOrdersByTime(t=None):
	#import cgi
	#fields=cgi.FieldStorage()
	t=getTime()
	import sqlite3
	con=sqlite3.connect(r".\menu.db")
	c=con.cursor()
	orders=[]
	prices={}
	usernames={}
	dishnames={}
	vendors=loadVendor(c)
	c.execute("""select o.userid,o.dishid,o.qty,u.username,d.name,d.price,d.vendor
							from orders o,dish d,user u
							where time="%s" 
							and o.dishid=d.rowid 
							and o.userid=u.rowid
						"""%t)
	db=c.fetchall()
	if len(db):
		for i in db:
			orders.append(order(i[0],i[1],i[2],i[6]))
			if i[0] not in usernames: usernames[i[0]]=i[3]
			if i[1] not in dishnames: dishnames[i[1]]=i[4]
			if i[1] not in prices: prices[i[1]]=i[5]
		return (orders,usernames,dishnames,prices,vendors,usernames.keys(),dishnames.keys())
	else:
		return None,None,None,None,None,None,None
(orders,usernames,dishnames,prices,vendors,users,dishes)=getOrdersByTime()
def getOrdersByUserid(userid):
	global orders
	res=[]
	for  o in orders:
		if o.userid ==userid:
			res.append((o.dishid,o.qty))
	return res
def getOrdersByDishid(dishid):
	"""
	returns the total qty of dishid, following with 
	a list of users ordered the dish
	"""
	global orders
	res=[]
	qtys={}
	for  o in orders:
		if o.dishid ==dishid:
			if o.userid not in qtys:qtys[o.userid]=0
			qtys[o.userid]+=o.qty
	return  sum(qtys.values()),qtys.items()
def getSumOfUser(userid):
	"""
	returns a list, containing sum of money of 
	users in the userid list(could be only one)
	"""
	sum=0
	s=0
	orders=getOrdersByUserid(userid)
	for (dishid,qty) in orders:
		sum+=getPrice(dishid)*float(qty)
	return sum
def getOrderOfVendor(vendor):
	"""
		returns  (sum,list_of_user_orders)	
					
	"""
	global orders
	dishes=[]
	for o in orders:
		if o.vendor ==vendor:
			dishes.append((o.dishid,getOrdersByDishid(o.dishid)[0]))
	sumVendor=sum([ float(x[1])*getPrice(x[0]) for x in dishes])
	if len(dishes):	
		return sumVendor,dishes
	else:
		return None,None
def view():
	if not orders:return
	for i in range(1,len(vendors)+1):
		sumVendor,dishes=getOrderOfVendor(i)
		if not dishes or not len(dishes): continue
		printf('<h2>%s'%getVendorName(i))
		printf( "%4.1f元</h2>"%sumVendor)
		printf (getContact(i))
		printf('<br><br>')
		for dishid,qty in dishes:
			s="%3d  X  %s<br>"%(qty,getDishName(dishid))
			printf( s.replace(" ","&nbsp;"))
			printf( "<br>")
	printf('<hr>')
	for u in users:
		sumUser,name=getSumOfUser(u),getUserName(u)
		printf('<h2>%s'%name)
		printf( "%4.1f元</h2>"%sumUser)
		for dishid,qty in getOrdersByUserid(u):
			s="%3d  X  %s<br>"%(qty,getDishName(dishid))
			printf( s.replace(" ","&nbsp;"))
			printf( "<br>")
	printf('<hr>')
#head
printf( "<head>")
printf( '<meta http-equiv="Content-Type" content="text/html;charset=utf-8">')
print '<script type="text/javascript" src="ajax.js" ></script>'
printf( "<style></style>")
printf( '<title>查看订餐单</title>')
printf( "</head>")
printf( "<body>")
view()

print '<a  href="main.py">返回</a>'
if not locked() and orders: print '  <input type="button" onclick="lock(1)" value="打电话"/>'
printf( '</body>')
f=file("./result.htm","w")
f.write(fout)
