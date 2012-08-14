#encoding=utf-8
def fill_users():
	import sqlite3
	con=sqlite3.connect(r".\menu.db")
	c=con.cursor()
	c.execute('''select username,password from user order by rowid asc''')
	users=c.fetchall()
	con.close()
	options=[]
	if users:
		for x in users:
			value="false"
			if x[1]!="":value="true"
			dic={}
			dic["username"],dic["hasPassword"]=x[0],value
			options.append(dic)
	return options
options=fill_users()
print 'Content-Type: text/html'
print
output=str(options).replace("u\'","\'")
print output