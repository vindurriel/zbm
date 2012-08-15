#encoding=utf-8
import cgi
fields=cgi.FieldStorage()
username,password="",""
if "username"  in fields :
	username= fields["username"].value
if "password" in fields:
	password=fields["password"].value
import sqlite3
con=sqlite3.connect(r".\menu.db")
c=con.cursor()
c.execute('''
select * from user where username='%s' and password='%s' 
'''%(username,password))
granted=c.fetchone()
print 'Content-Type: text/html'
print
if(granted):
	print "access granted"
else:
	print """
	<script language =javascript > function zz() { alert("用户名或密码不正确");window.location="test.py" } </script> 
	<body onload = "zz() "/>
	"""
import cgi
fields=cgi.FieldStorage()
username,password="",""
if "username"  in fields :
	username= fields["username"].value
if "password" in fields:
	password=fields["password"].value
import sqlite3
con=sqlite3.connect(r".\menu.db")
c=con.cursor()
c.execute('''
select * from user where username='%s' and password='%s' 
'''%(username,password))
granted=c.fetchone()
if(granted):
	print "access granted"
else:
	print "access denied"
