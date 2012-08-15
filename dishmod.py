import web
class dishmod:
	def POST(self):
		self.input=web.input()
		if not len(self.input):
			return "error:arguments null"
		return self.update()
	def GET(self):
		import db
		dishes=db.query("select rowid,* from dish order by rowid")
		db.close()
		try:
			dishes=[x.as_dic() for x in dishes]
		except Exception, e:
			return dishes
		import json
		d='dishdata = ' + json.dumps(dishes)
		render=web.template.render('.\\template',globals=dict(dishdata=d))
		return render.dishmod()
	def update(self):
		id=self.input.id
		if id==None:
			return "error:id"
		import db
		data=[]
		for prop in db.getattrs('dish'):
			if prop not in self.input: continue
			data.append([prop,self.input[prop]])
		if not len(data):
			return "error:property"
		values=' ,'.join(["%s = '%s'"%(x[0],x[1]) for x in data])
		cmd="update dish set %s where rowid=%s"%(values,id)
		db.query(cmd)
		db.commit()
		db.close()
		return "ok"
