import cgi,cgitb,db
cgitb.enable()
print 'Content-Type: text/html'
print
form = cgi.FieldStorage() 
id=form.getvalue('id')
if id:
	data=[]
	for prop in db.getattrs('dish'):
		v=form.getvalue(prop)
		if not v: continue
		data.append([prop,v])
	if not len(data):
		print "error:property"
	values=' ,'.join(["%s = '%s'"%(x[0],x[1]) for x in data])
	cmd="update dish set %s where rowid=%s"%(values,id)
	db.query(cmd)
	db.commit()
	print 'ok'
else:
	import db
	dishes=db.query("select rowid,* from dish order by rowid")
	print str([x.as_dic() for x in dishes]).replace("u\'","\'")

