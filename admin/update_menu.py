#encoding=utf-8
infile='.\\'
lines=open('.\\get_dish_pic.txt').readlines()
lines=[x.split() for x in lines]
names=set((x[0].decode('utf-8') for x in lines))
import db
dishes=db.query("select rowid,* from dish where vendor=1 order by rowid")
names_db=set((x.name for x in dishes))
common=names&names_db
a=names-names_db
b=names_db-names
print len(common),len(a),len(b)
dic={}
for y in lines:
	dic[y[0].decode('utf-8')]=y
for name in common:
	x=dic[name]
	cmd="update dish set zid='%s' where name='%s'"%(x[1],name)
def a():
	dic={}
	for y in lines:
		dic[y[0].decode('utf-8')]=y
	print db.getattrs('dish')
	t=u'汤'
	for x in dishes:
		if t in x.name:
			cmd=u"update dish set type='%s'  where zid='%s'"%(t,x.zid)
			print x.name.encode('gbk')
		#print cmd
		# db.query(cmd)
# db.commit()

# for name in a:
# 	x=dic[name]
# 	cmd="insert into dish values('%s',%s,'%s','%s', %d, '%s')"\
# 		%(x[0],x[1],'None','其他',1,x[2])
	# db.query(cmd)
# for name in a:
# 	x=dic[name]
# 	cmd="update dish set price=%s,zid='%s' where name='%s'"%(x[1],x[2],name)
# 	print cmd
	#db.query(cmd)
# db.commit()
