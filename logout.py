#encoding=utf-8
print 'Status: 302 Found'
import Cookie
c = Cookie.SimpleCookie()
c['u'] = ""
c['u']['max-age'] = 0
print c
print "Location: welcome.htm"
print