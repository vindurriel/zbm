#encoding=utf-8
def die():
	print 'Status: 200 OK'
	print 
	exit()
import cgi
fields=cgi.FieldStorage()
lock=None
if "lock" in fields :
	lock=fields["lock"].value
if lock=="0":
	import Cookie
	import os
	cookies = Cookie.SimpleCookie(os.environ.get("HTTP_COOKIE",""))
	u=None
	if not cookies.has_key("u"):
		die()
	try:u=int(cookies["u"].value)
	except:die()
	if u not in [12,7]:
		die()
f=file("lock","w")
f.write(lock)
f.close()
die()