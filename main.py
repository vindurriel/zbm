#encoding=utf-8
import Cookie
import os
cookies = Cookie.SimpleCookie(os.environ.get("HTTP_COOKIE",""))
if cookies.has_key("u") :
	print "Status: 302 Found"
	print "Location: client.py?u=%s"%cookies["u"].value
else:
	print "Status: 302 Found"
	print "Location: welcome.htm"
print ""
